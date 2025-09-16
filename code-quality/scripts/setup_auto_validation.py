#!/usr/bin/env python3
"""
Script para configurar validação automática
Configura hooks e validações automáticas
"""

import json
import os
import subprocess
import sys
from pathlib import Path


def setup_git_hooks():
    """Configura hooks do Git para validação automática"""
    print("Configurando Git hooks...")

    git_dir = Path(".git")
    if not git_dir.exists():
        print("Nao e um repositorio Git. Execute 'git init' primeiro.")
        return False

    hooks_dir = git_dir / "hooks"
    hooks_dir.mkdir(exist_ok=True)

    # Pre-commit hook
    pre_commit_hook = hooks_dir / "pre-commit"
    pre_commit_content = """#!/bin/sh
# Pre-commit hook para validacao automatica

echo "Validando codigo antes do commit..."

# Executar validacao
python scripts/validate_code_quality.py

if [ $? -ne 0 ]; then
    echo "Validacao falhou. Commit cancelado."
    echo "Execute 'python scripts/validate_code_quality.py' para ver os problemas."
    exit 1
fi

echo "Validacao passou. Prosseguindo com o commit..."
"""

    with open(pre_commit_hook, "w", encoding="utf-8") as f:
        f.write(pre_commit_content)

    # Tornar executável
    os.chmod(pre_commit_hook, 0o755)

    print("Pre-commit hook configurado")
    return True


def setup_vscode_tasks():
    """Configura tasks do VS Code para validação"""
    print("Configurando VS Code tasks...")

    vscode_dir = Path(".vscode")
    vscode_dir.mkdir(exist_ok=True)

    tasks_json = {
        "version": "2.0.0",
        "tasks": [
            {
                "label": "Validate Code Quality",
                "type": "shell",
                "command": "python",
                "args": ["scripts/validate_code_quality.py"],
                "group": "test",
                "presentation": {
                    "echo": True,
                    "reveal": "always",
                    "focus": False,
                    "panel": "shared",
                },
                "problemMatcher": [],
            },
            {
                "label": "Format Python",
                "type": "shell",
                "command": "python",
                "args": ["-m", "black", "app/", "scripts/", "--line-length", "100"],
                "group": "build",
                "presentation": {
                    "echo": True,
                    "reveal": "always",
                    "focus": False,
                    "panel": "shared",
                },
            },
            {
                "label": "Format JavaScript",
                "type": "shell",
                "command": "npm",
                "args": ["run", "format"],
                "options": {"cwd": "frontend"},
                "group": "build",
                "presentation": {
                    "echo": True,
                    "reveal": "always",
                    "focus": False,
                    "panel": "shared",
                },
            },
            {
                "label": "Format All",
                "dependsOrder": "sequence",
                "dependsOn": ["Format Python", "Format JavaScript"],
                "group": "build",
            },
        ],
    }

    with open(vscode_dir / "tasks.json", "w", encoding="utf-8") as f:
        json.dump(tasks_json, f, indent=2)

    print("VS Code tasks configuradas")
    return True


def setup_package_json_scripts():
    """Adiciona scripts de validação ao package.json"""
    print("Configurando scripts do package.json...")

    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("Diretorio frontend nao encontrado")
        return False

    package_json_path = frontend_dir / "package.json"
    if not package_json_path.exists():
        print("package.json nao encontrado")
        return False

    with open(package_json_path, "r", encoding="utf-8") as f:
        package_data = json.load(f)

    # Adicionar scripts de validação
    if "scripts" not in package_data:
        package_data["scripts"] = {}

    package_data["scripts"].update(
        {
            "validate": "cd .. && python scripts/validate_code_quality.py",
            "validate:python": "cd .. && python -m black --check app/ scripts/ --line-length 100 && python -m isort --check-only app/ scripts/ --profile black",
            "validate:js": "npm run format:check && npm run lint",
            "fix:all": "cd .. && python -m black app/ scripts/ --line-length 100 && python -m isort app/ scripts/ --profile black && cd frontend && npm run format && npm run lint:fix",
        }
    )

    with open(package_json_path, "w", encoding="utf-8") as f:
        json.dump(package_data, f, indent=2)

    print("Scripts do package.json configurados")
    return True


def create_validation_shortcuts():
    """Cria atalhos para validação rápida"""
    print("Criando atalhos de validacao...")

    # Atalho para Windows
    if os.name == "nt":
        batch_content = """@echo off
echo Validando codigo...
python scripts/validate_code_quality.py
if %errorlevel% neq 0 (
    echo.
    echo Validacao falhou!
    pause
    exit /b 1
)
echo.
echo Validacao passou!
pause
"""
        with open("validate.bat", "w", encoding="utf-8") as f:
            f.write(batch_content)

        print("Atalho validate.bat criado")

    # Atalho para Unix/Linux/Mac
    shell_content = """#!/bin/bash
echo "Validando codigo..."
python scripts/validate_code_quality.py

if [ $? -ne 0 ]; then
    echo ""
    echo "Validacao falhou!"
    exit 1
fi

echo ""
echo "Validacao passou!"
"""

    with open("validate.sh", "w", encoding="utf-8") as f:
        f.write(shell_content)
    os.chmod("validate.sh", 0o755)

    print("Atalho validate.sh criado")
    return True


def main():
    """Função principal"""
    print("Configurando validacao automatica...")
    print("=" * 50)

    success = True

    # Configurar Git hooks
    if not setup_git_hooks():
        success = False

    print()

    # Configurar VS Code tasks
    if not setup_vscode_tasks():
        success = False

    print()

    # Configurar package.json
    if not setup_package_json_scripts():
        success = False

    print()

    # Criar atalhos
    if not create_validation_shortcuts():
        success = False

    print()
    print("=" * 50)

    if success:
        print("Validacao automatica configurada com sucesso!")
        print()
        print("Opcoes de validacao disponiveis:")
        print("  • Git hooks: Validacao automatica antes de commits")
        print("  • VS Code tasks: Ctrl+Shift+P → 'Tasks: Run Task'")
        print("  • Atalhos: ./validate.sh ou validate.bat")
        print("  • npm scripts: npm run validate, npm run fix:all")
        print()
        print("Para ativar Git hooks:")
        print("  git add .")
        print("  git commit -m 'test'  # Vai validar automaticamente")
    else:
        print("Alguns problemas ocorreram durante a configuracao.")
        sys.exit(1)


if __name__ == "__main__":
    main()
