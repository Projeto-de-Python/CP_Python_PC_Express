from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from ..auth import get_current_active_user
from ..database import get_db
from ..models import PurchaseOrder, PurchaseOrderStatus, User

router = APIRouter(prefix="/simulation", tags=["simulation"])

# Instância global do simulador
simulator_instance = None


@router.post("/start")
def start_sales_simulation(
    duration_minutes: int = 10,
    max_pending_orders: int = 5,
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Inicia a simulação de vendas aleatórias"""
    global simulator_instance

    if simulator_instance and simulator_instance.is_running:
        raise HTTPException(status_code=400, detail="Simulação já está em execução")

    # Importa aqui para evitar import circular
    import sys
    from pathlib import Path

    # Adiciona o diretório raiz ao path
    root_dir = Path(__file__).parent.parent.parent
    sys.path.append(str(root_dir))
    from scripts.sales_simulator import SalesSimulator

    simulator_instance = SalesSimulator(user_id=current_user.id)
    simulator_instance.max_pending_orders = max_pending_orders

    # Inicia a simulação em background
    if background_tasks:
        background_tasks.add_task(simulator_instance.run_simulation, duration_minutes)

    return {
        "message": f"Simulação iniciada por {duration_minutes} minutos",
        "max_pending_orders": max_pending_orders,
        "duration_minutes": duration_minutes,
    }


@router.post("/stop")
def stop_sales_simulation(
    current_user: User = Depends(get_current_active_user),
):
    """Para a simulação de vendas"""
    global simulator_instance

    if not simulator_instance or not simulator_instance.is_running:
        raise HTTPException(status_code=400, detail="Nenhuma simulação em execução")

    simulator_instance.stop_simulation()

    return {"message": "Simulação parada com sucesso"}


@router.get("/status")
def get_simulation_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Retorna o status da simulação e estatísticas"""
    global simulator_instance

    # Conta purchase orders por status
    total_orders = (
        db.query(PurchaseOrder).filter(PurchaseOrder.user_id == current_user.id).count()
    )

    pending_orders = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.user_id == current_user.id,
            PurchaseOrder.status == PurchaseOrderStatus.PENDING_APPROVAL,
        )
        .count()
    )

    approved_orders = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.user_id == current_user.id,
            PurchaseOrder.status == PurchaseOrderStatus.APPROVED,
        )
        .count()
    )

    draft_orders = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.user_id == current_user.id,
            PurchaseOrder.status == PurchaseOrderStatus.DRAFT,
        )
        .count()
    )

    # Calcula valor total aprovado
    approved_value = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.user_id == current_user.id,
            PurchaseOrder.status == PurchaseOrderStatus.APPROVED,
        )
        .with_entities(db.func.sum(PurchaseOrder.total_value))
        .scalar()
        or 0
    )

    return {
        "is_running": simulator_instance.is_running if simulator_instance else False,
        "statistics": {
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "approved_orders": approved_orders,
            "draft_orders": draft_orders,
            "approved_value": float(approved_value),
        },
    }


@router.post("/approve-all")
def approve_all_pending_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Aprova todas as purchase orders pendentes"""
    pending_orders = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.user_id == current_user.id,
            PurchaseOrder.status == PurchaseOrderStatus.PENDING_APPROVAL,
        )
        .all()
    )

    if not pending_orders:
        raise HTTPException(
            status_code=404, detail="Nenhuma purchase order pendente encontrada"
        )

    approved_count = 0
    total_value = 0

    for po in pending_orders:
        po.status = PurchaseOrderStatus.APPROVED
        approved_count += 1
        total_value += po.total_value

    db.commit()

    return {
        "message": f"{approved_count} purchase orders aprovadas",
        "approved_count": approved_count,
        "total_value": total_value,
    }


@router.post("/clear-approved")
def clear_approved_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Remove todas as purchase orders aprovadas (simula recebimento)"""
    approved_orders = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.user_id == current_user.id,
            PurchaseOrder.status == PurchaseOrderStatus.APPROVED,
        )
        .all()
    )

    if not approved_orders:
        raise HTTPException(
            status_code=404, detail="Nenhuma purchase order aprovada encontrada"
        )

    cleared_count = len(approved_orders)
    total_value = sum(po.total_value for po in approved_orders)

    # Remove as purchase orders aprovadas
    for po in approved_orders:
        db.delete(po)

    db.commit()

    return {
        "message": f"{cleared_count} purchase orders aprovadas removidas",
        "cleared_count": cleared_count,
        "total_value": total_value,
    }
