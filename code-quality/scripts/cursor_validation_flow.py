#!/usr/bin/env python3
"""
Script para demonstrar o fluxo de validação do Cursor AI
Mostra o que acontece quando o código não passa na validação
"""

import subprocess
import sys
from pathlib import Path


def run_validation():
    """Executa validação e retorna resultado detalhado"""
    print("🔍 Executando validação...")

    try:
        result = subprocess.run(
            ["python", "scripts/validate_code_quality.py"],
            capture_output=True,
            text=True,
            cwd=Path.cwd(),
        )

        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)


def auto_fix_issues():
    """Tenta corrigir problemas automaticamente"""
    print("🔧 Tentando corrigir problemas automaticamente...")

    fixes_applied = []

    # 1. Formatar Python com Black
    try:
        result = subprocess.run(
            ["python", "-m", "black", "app/", "scripts/", "--line-length", "100"],
            capture_output=True,
            text=True,
        )
        if result.returncode == 0:
            fixes_applied.append("✅ Python formatado com Black")
        else:
            fixes_applied.append("❌ Erro ao formatar Python com Black")
    except Exception as e:
        fixes_applied.append(f"❌ Erro ao executar Black: {e}")

    # 2. Organizar imports Python
    try:
        result = subprocess.run(
            ["python", "-m", "isort", "app/", "scripts/", "--profile", "black"],
            capture_output=True,
            text=True,
        )
        if result.returncode == 0:
            fixes_applied.append("✅ Imports Python organizados com isort")
        else:
            fixes_applied.append("❌ Erro ao organizar imports Python")
    except Exception as e:
        fixes_applied.append(f"❌ Erro ao executar isort: {e}")

    # 3. Formatar JavaScript
    try:
        result = subprocess.run(
            ["npm", "run", "format"], capture_output=True, text=True, cwd=Path("frontend")
        )
        if result.returncode == 0:
            fixes_applied.append("✅ JavaScript formatado com Prettier")
        else:
            fixes_applied.append("❌ Erro ao formatar JavaScript")
    except Exception as e:
        fixes_applied.append(f"❌ Erro ao executar Prettier: {e}")

    # 4. Corrigir linting JavaScript
    try:
        result = subprocess.run(
            ["npm", "run", "lint:fix"], capture_output=True, text=True, cwd=Path("frontend")
        )
        if result.returncode == 0:
            fixes_applied.append("✅ Linting JavaScript corrigido")
        else:
            fixes_applied.append("❌ Erro ao corrigir linting JavaScript")
    except Exception as e:
        fixes_applied.append(f"❌ Erro ao executar ESLint: {e}")

    return fixes_applied


def show_validation_flow():
    """Demonstra o fluxo completo de validação"""
    print("🤖 FLUXO DE VALIDAÇÃO DO CURSOR AI")
    print("=" * 50)

    # 1. Executar validação inicial
    print("\n1️⃣ VALIDAÇÃO INICIAL")
    success, stdout, stderr = run_validation()

    if success:
        print("✅ Código passou na validação!")
        print("🎉 Cursor AI pode finalizar o código.")
        return True

    print("❌ Código NÃO passou na validação!")
    print("\n📋 PROBLEMAS ENCONTRADOS:")
    print(stdout)

    # 2. Tentar correção automática
    print("\n2️⃣ TENTATIVA DE CORREÇÃO AUTOMÁTICA")
    fixes = auto_fix_issues()

    for fix in fixes:
        print(f"  {fix}")

    # 3. Validar novamente
    print("\n3️⃣ VALIDAÇÃO APÓS CORREÇÕES")
    success, stdout, stderr = run_validation()

    if success:
        print("✅ Código passou na validação após correções!")
        print("🎉 Cursor AI pode finalizar o código.")
        return True

    print("❌ Código AINDA não passou na validação!")
    print("\n📋 PROBLEMAS RESTANTES:")
    print(stdout)

    # 4. Mostrar próximos passos
    print("\n4️⃣ PRÓXIMOS PASSOS PARA CURSOR AI")
    print("🔧 O Cursor AI deve:")
    print("  1. Analisar os problemas restantes")
    print("  2. Refatorar código manualmente")
    print("  3. Quebrar arquivos grandes em módulos menores")
    print("  4. Executar validação novamente")
    print("  5. Repetir até passar na validação")

    return False


def show_cursor_ai_behavior():
    """Mostra como o Cursor AI deve se comportar"""
    print("\n🤖 COMPORTAMENTO DO CURSOR AI")
    print("=" * 50)

    print("\n📋 QUANDO O CÓDIGO NÃO PASSA NA VALIDAÇÃO:")
    print("  1. ❌ Cursor AI NÃO deve finalizar o código")
    print("  2. 🔧 Cursor AI deve tentar correção automática")
    print("  3. 🔄 Cursor AI deve executar validação novamente")
    print("  4. 📝 Cursor AI deve refatorar se necessário")
    print("  5. ✅ Cursor AI só finaliza quando passar na validação")

    print("\n🚫 O QUE CURSOR AI NÃO DEVE FAZER:")
    print("  • Finalizar código com problemas de validação")
    print("  • Ignorar regras de formatação")
    print("  • Deixar arquivos muito grandes")
    print("  • Pular a validação")

    print("\n✅ O QUE CURSOR AI DEVE FAZER:")
    print("  • Sempre executar validação antes de finalizar")
    print("  • Corrigir problemas automaticamente quando possível")
    print("  • Refatorar código quando necessário")
    print("  • Manter consistência com o projeto")
    print("  • Seguir as regras do .cursorrules")


def main():
    """Função principal"""
    print("🔍 SIMULANDO FLUXO DE VALIDAÇÃO DO CURSOR AI")
    print("=" * 60)

    # Mostrar comportamento esperado
    show_cursor_ai_behavior()

    print("\n" + "=" * 60)

    # Simular fluxo de validação
    success = show_validation_flow()

    print("\n" + "=" * 60)

    if success:
        print("🎉 RESULTADO: Código válido! Cursor AI pode finalizar.")
        sys.exit(0)
    else:
        print("⚠️ RESULTADO: Código inválido! Cursor AI deve corrigir.")
        sys.exit(1)


if __name__ == "__main__":
    main()
