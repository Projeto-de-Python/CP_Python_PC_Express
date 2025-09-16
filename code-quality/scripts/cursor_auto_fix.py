#!/usr/bin/env python3
"""
Script para Cursor AI - Validação e correção automática
Este script deve ser executado pelo Cursor AI quando a validação falha
"""

import subprocess
import sys
from pathlib import Path


def run_command(command, cwd=None):
    """Executa um comando e retorna o resultado"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)


def validate_code():
    """Executa validação completa"""
    print("🔍 Validando código...")
    success, stdout, stderr = run_command("python scripts/validate_code_quality.py")
    return success, stdout, stderr


def auto_fix_python():
    """Corrige problemas Python automaticamente"""
    print("🐍 Corrigindo Python...")

    fixes = []

    # Black
    success, stdout, stderr = run_command("python -m black app/ scripts/ --line-length 100")
    if success:
        fixes.append("✅ Python formatado com Black")
    else:
        fixes.append("❌ Erro ao formatar Python com Black")

    # isort
    success, stdout, stderr = run_command("python -m isort app/ scripts/ --profile black")
    if success:
        fixes.append("✅ Imports Python organizados com isort")
    else:
        fixes.append("❌ Erro ao organizar imports Python")

    return fixes


def auto_fix_javascript():
    """Corrige problemas JavaScript automaticamente"""
    print("🟨 Corrigindo JavaScript...")

    fixes = []

    # Prettier
    success, stdout, stderr = run_command("npm run format", cwd="frontend")
    if success:
        fixes.append("✅ JavaScript formatado com Prettier")
    else:
        fixes.append("❌ Erro ao formatar JavaScript com Prettier")

    # ESLint
    success, stdout, stderr = run_command("npm run lint:fix", cwd="frontend")
    if success:
        fixes.append("✅ Linting JavaScript corrigido com ESLint")
    else:
        fixes.append("❌ Erro ao corrigir linting JavaScript")

    return fixes


def analyze_remaining_issues(validation_output):
    """Analisa problemas que não podem ser corrigidos automaticamente"""
    issues = []

    if "Arquivos muito grandes encontrados" in validation_output:
        issues.append("📏 Arquivos muito grandes - precisa refatoração manual")

    if "Black: Código não está formatado" in validation_output:
        issues.append("🐍 Problemas de formatação Python - pode precisar refatoração")

    if "ESLint: Problemas de linting" in validation_output:
        issues.append("🟨 Problemas de linting JavaScript - pode precisar refatoração")

    return issues


def main():
    """Função principal para Cursor AI"""
    print("🤖 CURSOR AI - VALIDAÇÃO E CORREÇÃO AUTOMÁTICA")
    print("=" * 50)

    # 1. Validar código inicial
    print("\n1️⃣ VALIDAÇÃO INICIAL")
    success, stdout, stderr = validate_code()

    if success:
        print("✅ Código já está válido!")
        print("🎉 Cursor AI pode finalizar o código.")
        return True

    print("❌ Código não passou na validação!")
    print("📋 Problemas encontrados:")
    print(stdout)

    # 2. Tentar correção automática
    print("\n2️⃣ CORREÇÃO AUTOMÁTICA")

    python_fixes = auto_fix_python()
    js_fixes = auto_fix_javascript()

    all_fixes = python_fixes + js_fixes

    for fix in all_fixes:
        print(f"  {fix}")

    # 3. Validar novamente
    print("\n3️⃣ VALIDAÇÃO APÓS CORREÇÕES")
    success, stdout, stderr = validate_code()

    if success:
        print("✅ Código passou na validação após correções!")
        print("🎉 Cursor AI pode finalizar o código.")
        return True

    print("❌ Código ainda não passou na validação!")
    print("📋 Problemas restantes:")
    print(stdout)

    # 4. Analisar problemas restantes
    print("\n4️⃣ ANÁLISE DE PROBLEMAS RESTANTES")
    remaining_issues = analyze_remaining_issues(stdout)

    if remaining_issues:
        print("⚠️ Problemas que precisam de correção manual:")
        for issue in remaining_issues:
            print(f"  {issue}")

    print("\n🔧 PRÓXIMOS PASSOS PARA CURSOR AI:")
    print("  1. Refatorar arquivos grandes em módulos menores")
    print("  2. Corrigir problemas de estrutura manualmente")
    print("  3. Executar validação novamente")
    print("  4. Repetir até passar na validação")

    print("\n❌ CURSOR AI NÃO DEVE FINALIZAR O CÓDIGO AINDA!")
    print("✅ Cursor AI deve continuar corrigindo até passar na validação.")

    return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
