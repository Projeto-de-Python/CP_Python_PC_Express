#!/usr/bin/env python3
"""
PC-Express - Sistema de Monitoramento de Plágio
Copyright (c) 2024 Equipe Big 5

Script para monitorar possíveis plágios do projeto PC-Express
"""

import requests
import json
import time
from datetime import datetime
import os

class PlagiarismMonitor:
    def __init__(self):
        self.project_name = "PC-Express"
        self.team_name = "Equipe Big 5"
        self.team_members = [
            "Lucca Phelipe Masini",
            "Luiz Henrique Poss", 
            "Luis Fernando de Oliveira Salgado",
            "Igor Paixão Sarak",
            "Bernardo Braga Perobeli"
        ]
        self.unique_phrases = [
            "PC-Express - Sistema de Gerenciamento de Inventário",
            "Equipe Big 5",
            "Sistema de gerenciamento de inventário",
            "Machine Learning aplicado",
            "FastAPI + React + SQLAlchemy"
        ]
        
    def search_github(self, query):
        """Busca no GitHub por repositórios suspeitos"""
        try:
            url = f"https://api.github.com/search/repositories?q={query}"
            response = requests.get(url)
            
            if response.status_code == 200:
                data = response.json()
                return data.get('items', [])
            else:
                print(f"Erro na busca GitHub: {response.status_code}")
                return []
        except Exception as e:
            print(f"Erro na busca GitHub: {e}")
            return []
    
    def check_suspicious_repos(self):
        """Verifica repositórios suspeitos"""
        suspicious_repos = []
        
        # Buscar por frases únicas
        for phrase in self.unique_phrases:
            print(f"Buscando por: {phrase}")
            repos = self.search_github(phrase)
            
            for repo in repos:
                if self.is_suspicious(repo):
                    suspicious_repos.append({
                        'repo': repo,
                        'reason': f"Contém frase: {phrase}",
                        'found_at': datetime.now().isoformat()
                    })
            
            time.sleep(1)  # Rate limiting
        
        return suspicious_repos
    
    def is_suspicious(self, repo):
        """Verifica se um repositório é suspeito"""
        name = repo.get('name', '').lower()
        description = repo.get('description', '').lower()
        full_name = repo.get('full_name', '').lower()
        
        # Verificar se não é nosso próprio repositório
        if 'pc-express' in full_name or 'cp_python_pc_express' in full_name:
            return False
        
        # Verificar palavras-chave suspeitas
        suspicious_keywords = [
            'inventario', 'inventário', 'estoque', 'gerenciamento',
            'pc-express', 'equipe big 5', 'fastapi', 'react'
        ]
        
        text_to_check = f"{name} {description} {full_name}"
        
        for keyword in suspicious_keywords:
            if keyword in text_to_check:
                return True
        
        return False
    
    def generate_report(self, suspicious_repos):
        """Gera relatório de monitoramento"""
        report = {
            'date': datetime.now().isoformat(),
            'project': self.project_name,
            'team': self.team_name,
            'total_suspicious': len(suspicious_repos),
            'repositories': suspicious_repos
        }
        
        return report
    
    def save_report(self, report):
        """Salva relatório em arquivo"""
        filename = f"plagiarism_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        filepath = os.path.join('reports', filename)
        
        # Criar diretório se não existir
        os.makedirs('reports', exist_ok=True)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"Relatório salvo em: {filepath}")
        return filepath
    
    def print_summary(self, report):
        """Imprime resumo do relatório"""
        print("\n" + "="*50)
        print("🔍 RELATÓRIO DE MONITORAMENTO DE PLÁGIO")
        print("="*50)
        print(f"📅 Data: {report['date']}")
        print(f"🎯 Projeto: {report['project']}")
        print(f"👥 Equipe: {report['team']}")
        print(f"🚨 Repositórios suspeitos: {report['total_suspicious']}")
        print("="*50)
        
        if report['total_suspicious'] > 0:
            print("\n🚨 REPOSITÓRIOS SUSPEITOS ENCONTRADOS:")
            for i, repo_info in enumerate(report['repositories'], 1):
                repo = repo_info['repo']
                print(f"\n{i}. {repo['full_name']}")
                print(f"   📝 Descrição: {repo.get('description', 'N/A')}")
                print(f"   🔗 URL: {repo['html_url']}")
                print(f"   ⭐ Stars: {repo.get('stargazers_count', 0)}")
                print(f"   🍴 Forks: {repo.get('forks_count', 0)}")
                print(f"   📅 Criado: {repo.get('created_at', 'N/A')}")
                print(f"   🎯 Motivo: {repo_info['reason']}")
        else:
            print("\n✅ Nenhum repositório suspeito encontrado!")
        
        print("\n" + "="*50)
    
    def run_monitoring(self):
        """Executa o monitoramento completo"""
        print("🔍 Iniciando monitoramento de plágio...")
        print(f"🎯 Projeto: {self.project_name}")
        print(f"👥 Equipe: {self.team_name}")
        print("-" * 50)
        
        # Verificar repositórios suspeitos
        suspicious_repos = self.check_suspicious_repos()
        
        # Gerar relatório
        report = self.generate_report(suspicious_repos)
        
        # Salvar relatório
        report_file = self.save_report(report)
        
        # Imprimir resumo
        self.print_summary(report)
        
        return report

def main():
    """Função principal"""
    print("🚀 PC-Express - Monitor de Plágio")
    print("© 2024 Equipe Big 5")
    print("-" * 50)
    
    monitor = PlagiarismMonitor()
    report = monitor.run_monitoring()
    
    print(f"\n📊 Monitoramento concluído!")
    print(f"📁 Relatório salvo em: reports/")
    
    if report['total_suspicious'] > 0:
        print("\n⚠️  ATENÇÃO: Repositórios suspeitos encontrados!")
        print("📋 Revise o relatório e tome as ações necessárias.")
    else:
        print("\n✅ Nenhuma atividade suspeita detectada.")

if __name__ == "__main__":
    main()
