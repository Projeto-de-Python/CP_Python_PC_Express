#!/usr/bin/env python3
"""
Sales Simulator for PC-Express
Simula vendas aleatórias criando purchase orders automaticamente
"""

import asyncio
import random
import time
from datetime import datetime
from typing import List

from app.database import SessionLocal
from app.models import (
    Product,
    PurchaseOrder,
    PurchaseOrderItem,
    PurchaseOrderStatus,
    Supplier,
)


class SalesSimulator:
    def __init__(self, user_id: int = 1):
        self.user_id = user_id
        self.is_running = False
        self.max_pending_orders = 5  # Máximo de POs pendentes
        self.min_interval = 10  # Intervalo mínimo entre vendas (segundos)
        self.max_interval = 30  # Intervalo máximo entre vendas (segundos)

    def get_random_supplier(self, db) -> Supplier:
        """Seleciona um fornecedor aleatório"""
        suppliers = db.query(Supplier).filter(Supplier.user_id == self.user_id).all()
        return random.choice(suppliers) if suppliers else None

    def get_random_products(
        self, db, supplier_id: int, count: int = None
    ) -> List[Product]:
        """Seleciona produtos aleatórios de um fornecedor"""
        products = (
            db.query(Product)
            .filter(
                Product.user_id == self.user_id,
                Product.fornecedor_id == supplier_id,
                Product.quantidade > 0,  # Apenas produtos em estoque
            )
            .all()
        )

        if not products:
            return []

        # Seleciona entre 1 e 4 produtos aleatórios
        if count is None:
            count = random.randint(1, min(4, len(products)))

        return random.sample(products, min(count, len(products)))

    def create_random_purchase_order(self, db) -> PurchaseOrder:
        """Cria uma purchase order aleatória"""
        supplier = self.get_random_supplier(db)
        if not supplier:
            return None

        products = self.get_random_products(db, supplier.id)
        if not products:
            return None

        # Cria a purchase order
        po = PurchaseOrder(
            user_id=self.user_id,
            fornecedor_id=supplier.id,
            status=PurchaseOrderStatus.PENDING_APPROVAL,
            observacoes=f"Venda simulada - {datetime.now().strftime('%d/%m/%Y %H:%M')}",
        )
        db.add(po)
        db.flush()  # Para obter o ID

        # Adiciona itens aleatórios
        total_value = 0
        for product in products:
            # Quantidade aleatória entre 1 e 5
            quantity = random.randint(1, 5)

            item = PurchaseOrderItem(
                purchase_order_id=po.id,
                produto_id=product.id,
                quantidade_solicitada=quantity,
                preco_unitario=product.preco,
            )
            db.add(item)
            total_value += quantity * product.preco

        po.total_value = total_value
        return po

    def get_pending_orders_count(self, db) -> int:
        """Conta quantas purchase orders estão pendentes"""
        return (
            db.query(PurchaseOrder)
            .filter(
                PurchaseOrder.user_id == self.user_id,
                PurchaseOrder.status == PurchaseOrderStatus.PENDING_APPROVAL,
            )
            .count()
        )

    async def run_simulation(self, duration_minutes: int = 10):
        """Executa a simulação por um período determinado"""
        print(f"🚀 Iniciando simulação de vendas por {duration_minutes} minutos...")
        print(f"📊 Configurações:")
        print(f"   - Máximo de POs pendentes: {self.max_pending_orders}")
        print(f"   - Intervalo entre vendas: {self.min_interval}-{self.max_interval}s")
        print(f"   - Duração: {duration_minutes} minutos")
        print("=" * 50)

        self.is_running = True
        start_time = time.time()
        end_time = start_time + (duration_minutes * 60)
        orders_created = 0

        try:
            while self.is_running and time.time() < end_time:
                db = SessionLocal()
                try:
                    # Verifica se pode criar mais vendas
                    pending_count = self.get_pending_orders_count(db)

                    if pending_count < self.max_pending_orders:
                        # Cria uma nova venda
                        po = self.create_random_purchase_order(db)
                        if po:
                            db.commit()
                            orders_created += 1
                            print(
                                f"✅ Venda #{orders_created} criada - PO #{po.id} - R$ {po.total_value:.2f} - {po.observacoes}"
                            )
                        else:
                            print(
                                "⚠️  Não foi possível criar venda (sem produtos/fornecedores)"
                            )
                    else:
                        print(
                            f"⏸️  Aguardando aprovação de vendas... ({pending_count}/{self.max_pending_orders} pendentes)"
                        )

                    # Intervalo aleatório até a próxima venda
                    interval = random.randint(self.min_interval, self.max_interval)
                    print(f"⏰ Próxima venda em {interval} segundos...")

                except Exception as e:
                    print(f"❌ Erro ao criar venda: {e}")
                    db.rollback()
                finally:
                    db.close()

                # Aguarda o intervalo
                await asyncio.sleep(interval)

        except KeyboardInterrupt:
            print("\n🛑 Simulação interrompida pelo usuário")

        self.is_running = False
        elapsed_time = (time.time() - start_time) / 60
        print("=" * 50)
        print(f"🏁 Simulação finalizada!")
        print(f"📈 Estatísticas:")
        print(f"   - Tempo decorrido: {elapsed_time:.1f} minutos")
        print(f"   - Vendas criadas: {orders_created}")
        print(f"   - Vendas pendentes: {self.get_pending_orders_count(SessionLocal())}")

    def stop_simulation(self):
        """Para a simulação"""
        self.is_running = False
        print("🛑 Parando simulação...")


async def main():
    """Função principal para executar a simulação"""
    simulator = SalesSimulator()

    print("🎯 Simulador de Vendas PC-Express")
    print("=" * 40)

    try:
        # Executa por 10 minutos por padrão
        await simulator.run_simulation(duration_minutes=10)
    except KeyboardInterrupt:
        simulator.stop_simulation()


if __name__ == "__main__":
    asyncio.run(main())
