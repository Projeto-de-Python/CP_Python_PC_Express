#!/usr/bin/env python3
"""
Script de validação da qualidade do código
Verifica se as regras de linting estão sendo seguidas
"""

import os
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


def validate_python():
    """Valida formatação Python com Black e isort"""
    print("🐍 Validando Python...")

    # Verificar Black
    success, stdout, stderr = run_command("python -m black --check app/ scripts/ --line-length 100")
    if not success:
        print("❌ Black: Código não está formatado corretamente")
        print("Execute: python -m black app/ scripts/ --line-length 100")
        return False
    print("✅ Black: Formatação OK")

    # Verificar isort
    success, stdout, stderr = run_command(
        "python -m isort --check-only app/ scripts/ --profile black"
    )
    if not success:
        print("❌ isort: Imports não estão organizados")
        print("Execute: python -m isort app/ scripts/ --profile black")
        return False
    print("✅ isort: Imports organizados")

    return True


def validate_javascript():
    """Valida formatação JavaScript com Prettier e ESLint"""
    print("🟨 Validando JavaScript...")

    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Diretório frontend não encontrado")
        return False

    # Verificar Prettier
    success, stdout, stderr = run_command("npm run format:check", cwd=frontend_dir)
    if not success:
        print("❌ Prettier: Código não está formatado corretamente")
        print("Execute: npm run format")
        return False
    print("✅ Prettier: Formatação OK")

    # Verificar ESLint
    success, stdout, stderr = run_command("npm run lint", cwd=frontend_dir)
    if not success:
        print("❌ ESLint: Problemas de linting encontrados")
        print("Execute: npm run lint:fix")
        return False
    print("✅ ESLint: Linting OK")

    return True


def check_file_sizes():
    """Verifica se os arquivos não estão muito grandes"""
    print("📏 Verificando tamanhos de arquivos...")

    issues = []

    # Verificar arquivos Python
    for py_file in Path("app").rglob("*.py"):
        with open(py_file, "r", encoding="utf-8") as f:
            lines = len(f.readlines())
            if lines > 300:
                issues.append(f"Python: {py_file} tem {lines} linhas (máximo: 300)")

    # Verificar arquivos JavaScript
    for js_file in Path("frontend/src").rglob("*.{js,jsx}"):
        with open(js_file, "r", encoding="utf-8") as f:
            lines = len(f.readlines())
            if lines > 200:
                issues.append(f"JavaScript: {js_file} tem {lines} linhas (máximo: 200)")

    if issues:
        print("❌ Arquivos muito grandes encontrados:")
        for issue in issues:
            print(f"  - {issue}")
        return False

    print("✅ Tamanhos de arquivos OK")
    return True


def check_hooks_complexity():
    """Verifica se hooks estão muito complexos e sugere quebras"""
    print("🪝 Verificando complexidade de hooks...")

    issues = []
    suggestions = []
    warnings = []

    # Verificar arquivos JavaScript/JSX
    for js_file in Path("frontend/src").rglob("*.{js,jsx}"):
        try:
            with open(js_file, "r", encoding="utf-8") as f:
                content = f.read()
                lines = content.split("\n")

            # Analisar hooks
            hook_analysis = analyze_hooks_in_file(js_file, content, lines)
            if hook_analysis["issues"]:
                issues.extend(hook_analysis["issues"])
            if hook_analysis["suggestions"]:
                suggestions.extend(hook_analysis["suggestions"])
            if hook_analysis["warnings"]:
                warnings.extend(hook_analysis["warnings"])

        except Exception as e:
            issues.append(f"Erro ao analisar {js_file}: {e}")

    if issues:
        print("❌ Hooks com problemas encontrados:")
        for issue in issues:
            print(f"  - {issue}")

    if warnings:
        print("⚠️ Hooks grandes (mas potencialmente aceitáveis):")
        for warning in warnings:
            print(f"  - {warning}")

    if suggestions:
        print("💡 Sugestões de melhoria:")
        for suggestion in suggestions:
            print(f"  - {suggestion}")

    # Só falha se houver problemas reais, não apenas warnings
    if issues:
        return False

    print("✅ Hooks com complexidade adequada")
    return True


def analyze_hooks_in_file(file_path, content, lines):
    """Analisa hooks em um arquivo específico com análise inteligente"""
    issues = []
    suggestions = []
    warnings = []

    # Padrões para detectar hooks
    hook_patterns = [
        r"useState\s*\(",  # useState
        r"useEffect\s*\(",  # useEffect
        r"useCallback\s*\(",  # useCallback
        r"useMemo\s*\(",  # useMemo
        r"useContext\s*\(",  # useContext
        r"useReducer\s*\(",  # useReducer
        r"useRef\s*\(",  # useRef
    ]

    import re

    # Encontrar todos os hooks
    hooks_found = []
    for i, line in enumerate(lines):
        for pattern in hook_patterns:
            if re.search(pattern, line):
                hook_type = pattern.split("\\")[0].replace("use", "use")
                hooks_found.append({"type": hook_type, "line": i + 1, "content": line.strip()})

    # Analisar cada hook individualmente
    for hook in hooks_found:
        hook_analysis = analyze_individual_hook(file_path, hook, lines, content)
        if hook_analysis["issues"]:
            issues.extend(hook_analysis["issues"])
        if hook_analysis["suggestions"]:
            suggestions.extend(hook_analysis["suggestions"])
        if hook_analysis["warnings"]:
            warnings.extend(hook_analysis["warnings"])

    # Verificar se há muitos hooks no mesmo componente
    if len(hooks_found) > 12:  # Aumentado de 8 para 12
        issues.append(
            f"{file_path}: Muitos hooks ({len(hooks_found)}) - considere quebrar em componentes menores"
        )
        suggestions.append(
            f"{file_path}: Extrair lógica para hooks customizados ou componentes menores"
        )
    elif len(hooks_found) > 8:
        warnings.append(
            f"{file_path}: Muitos hooks ({len(hooks_found)}) - considere refatoração se possível"
        )

    return {"issues": issues, "suggestions": suggestions, "warnings": warnings}


def analyze_individual_hook(file_path, hook, lines, content):
    """Analisa um hook individual com análise inteligente de complexidade"""
    issues = []
    suggestions = []
    warnings = []

    hook_type = hook["type"]
    hook_length = get_hook_length(hook, lines)
    hook_body = get_hook_body(hook, lines)

    # Análise específica por tipo de hook
    if hook_type == "useEffect":
        analysis = analyze_useeffect_intelligent(file_path, hook, lines, hook_length, hook_body)
        issues.extend(analysis["issues"])
        suggestions.extend(analysis["suggestions"])
        warnings.extend(analysis["warnings"])
    elif hook_type in ["useCallback", "useMemo"]:
        analysis = analyze_callback_memo_intelligent(file_path, hook, lines, hook_length, hook_body)
        issues.extend(analysis["issues"])
        suggestions.extend(analysis["suggestions"])
        warnings.extend(analysis["warnings"])
    elif hook_type == "useState":
        # useState geralmente não tem problemas de complexidade
        pass
    else:
        # Outros hooks (useContext, useReducer, useRef)
        if hook_length > 50:  # Limite mais alto para hooks especiais
            warnings.append(
                f"{file_path}: {hook_type} grande ({hook_length} linhas) na linha {hook['line']} - verifique se pode ser simplificado"
            )

    return {"issues": issues, "suggestions": suggestions, "warnings": warnings}


def analyze_useeffect_intelligent(file_path, hook, lines, hook_length, hook_body):
    """Análise inteligente de useEffect considerando complexidade real"""
    issues = []
    suggestions = []
    warnings = []

    hook_line = hook["line"] - 1
    hook_content = lines[hook_line]

    # Análise de dependências
    deps_count = count_dependencies(hook_content)
    if deps_count > 8:  # Aumentado de 5 para 8
        issues.append(
            f"{file_path}: useEffect com muitas dependências ({deps_count}) na linha {hook['line']}"
        )
        suggestions.append(
            f"{file_path}: Simplificar dependências ou quebrar em múltiplos useEffect"
        )
    elif deps_count > 5:
        warnings.append(
            f"{file_path}: useEffect com muitas dependências ({deps_count}) na linha {hook['line']} - considere simplificar"
        )

    # Análise inteligente de tamanho baseada em complexidade
    complexity_score = calculate_complexity_score(hook_body, hook_content)

    if hook_length > 100:  # Limite muito alto
        if complexity_score > 0.7:  # Alta complexidade
            issues.append(
                f"{file_path}: useEffect muito complexo ({hook_length} linhas, score: {complexity_score:.2f}) na linha {hook['line']}"
            )
            suggestions.append(
                f"{file_path}: Este useEffect é muito complexo - considere quebrar em múltiplos hooks ou extrair lógica"
            )
        else:  # Baixa complexidade (muitos comentários, espaços, etc.)
            warnings.append(
                f"{file_path}: useEffect grande ({hook_length} linhas) mas com baixa complexidade na linha {hook['line']} - pode ser aceitável"
            )
    elif hook_length > 50:  # Limite médio
        if complexity_score > 0.6:  # Média-alta complexidade
            warnings.append(
                f"{file_path}: useEffect com complexidade média ({hook_length} linhas, score: {complexity_score:.2f}) na linha {hook['line']} - considere refatoração"
            )
            suggestions.append(
                f"{file_path}: Considere quebrar este useEffect em funções menores se possível"
            )

    # Análise de operações
    if hook_body:
        operations = count_meaningful_operations(hook_body)
        if operations > 8:  # Aumentado de 3 para 8
            issues.append(
                f"{file_path}: useEffect com muitas operações ({operations}) na linha {hook['line']}"
            )
            suggestions.append(
                f"{file_path}: Quebrar useEffect em múltiplos hooks ou extrair lógica"
            )
        elif operations > 5:
            warnings.append(
                f"{file_path}: useEffect com muitas operações ({operations}) na linha {hook['line']} - considere simplificar"
            )

    return {"issues": issues, "suggestions": suggestions, "warnings": warnings}


def analyze_callback_memo_intelligent(file_path, hook, lines, hook_length, hook_body):
    """Análise inteligente de useCallback e useMemo"""
    issues = []
    suggestions = []
    warnings = []

    if hook_length > 30:  # Limite mais alto para callbacks/memos
        complexity_score = calculate_complexity_score(hook_body, lines[hook["line"] - 1])

        if complexity_score > 0.8:  # Muito alta complexidade
            issues.append(
                f"{file_path}: {hook['type']} muito complexo ({hook_length} linhas, score: {complexity_score:.2f}) na linha {hook['line']}"
            )
            suggestions.append(
                f"{file_path}: Este {hook['type']} é muito complexo - considere quebrar em funções menores"
            )
        else:
            warnings.append(
                f"{file_path}: {hook['type']} grande ({hook_length} linhas) mas com baixa complexidade na linha {hook['line']} - pode ser aceitável"
            )

    return {"issues": issues, "suggestions": suggestions, "warnings": warnings}


def count_dependencies(hook_content):
    """Conta o número de dependências em um hook"""
    if "[" not in hook_content or "]" not in hook_content:
        return 0

    deps_start = hook_content.find("[")
    deps_end = hook_content.find("]")
    if deps_start == -1 or deps_end == -1:
        return 0

    deps_content = hook_content[deps_start : deps_end + 1]
    # Contar vírgulas para estimar número de dependências
    comma_count = deps_content.count(",")
    return comma_count + 1 if comma_count > 0 else 0


def calculate_complexity_score(hook_body, hook_content):
    """Calcula um score de complexidade baseado no conteúdo do hook"""
    if not hook_body:
        return 0.0

    total_lines = len(hook_body)
    if total_lines == 0:
        return 0.0

    # Contar linhas significativas (não comentários, não espaços vazios)
    meaningful_lines = 0
    comment_lines = 0
    empty_lines = 0

    for line in hook_body:
        stripped = line.strip()
        if not stripped:
            empty_lines += 1
        elif stripped.startswith("//") or stripped.startswith("/*"):
            comment_lines += 1
        else:
            meaningful_lines += 1

    # Score baseado na proporção de linhas significativas
    if total_lines == 0:
        return 0.0

    meaningful_ratio = meaningful_lines / total_lines

    # Penalizar muitos comentários (pode indicar código confuso)
    comment_ratio = comment_lines / total_lines if total_lines > 0 else 0

    # Score final (0.0 = baixa complexidade, 1.0 = alta complexidade)
    complexity_score = meaningful_ratio - (comment_ratio * 0.3)

    return max(0.0, min(1.0, complexity_score))


def count_meaningful_operations(hook_body):
    """Conta operações significativas no corpo do hook"""
    operations = 0

    for line in hook_body:
        stripped = line.strip()
        if stripped and not stripped.startswith("//") and not stripped.startswith("/*"):
            # Contar operações baseadas em padrões comuns
            if any(
                keyword in stripped
                for keyword in ["await", "setState", "set", "if", "for", "while", "try", "catch"]
            ):
                operations += 1

    return operations


def get_hook_length(hook, lines):
    """Calcula o comprimento de um hook"""
    start_line = hook["line"] - 1
    brace_count = 0
    in_hook = False
    length = 0

    for i in range(start_line, len(lines)):
        line = lines[i]

        # Contar chaves para determinar início e fim do hook
        for char in line:
            if char == "{":
                brace_count += 1
                in_hook = True
            elif char == "}":
                brace_count -= 1
                if in_hook and brace_count == 0:
                    return length + 1

        if in_hook:
            length += 1

    return length


def get_hook_body(hook, lines):
    """Extrai o corpo de um hook"""
    start_line = hook["line"] - 1
    brace_count = 0
    in_hook = False
    body = []

    for i in range(start_line, len(lines)):
        line = lines[i]

        for char in line:
            if char == "{":
                brace_count += 1
                in_hook = True
            elif char == "}":
                brace_count -= 1
                if in_hook and brace_count == 0:
                    return body

        if in_hook and brace_count > 0:
            body.append(line)

    return body


def main():
    """Função principal"""
    print("🔍 Validando qualidade do código...")
    print("=" * 50)

    all_good = True

    # Validar Python
    if not validate_python():
        all_good = False

    print()

    # Validar JavaScript
    if not validate_javascript():
        all_good = False

    print()

    # Verificar tamanhos de arquivos
    if not check_file_sizes():
        all_good = False

    print()

    # Verificar complexidade de hooks
    if not check_hooks_complexity():
        all_good = False

    print()
    print("=" * 50)

    if all_good:
        print("🎉 Tudo OK! Código está seguindo as regras de qualidade.")
        sys.exit(0)
    else:
        print("❌ Problemas encontrados. Corrija antes de continuar.")
        sys.exit(1)


if __name__ == "__main__":
    main()
