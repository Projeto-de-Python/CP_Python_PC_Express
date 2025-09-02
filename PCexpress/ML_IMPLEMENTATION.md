# 🤖 Machine Learning Implementation - PCexpress

## 📋 Visão Geral

O sistema PCexpress agora inclui funcionalidades avançadas de Machine Learning que trabalham exclusivamente com dados reais do seu banco SQLite. **Não há mais aleatoriedade** - todos os algoritmos analisam dados históricos reais para fornecer insights acionáveis.

## 🚀 Funcionalidades Implementadas

### 1. **Previsão de Demanda** 📈
- **Algoritmo**: Regressão Linear com Features Temporais
- **Dados**: Histórico de vendas dos últimos 180 dias
- **Features**: Dia da semana, mês, lags (1 e 7 dias), médias móveis
- **Saída**: Previsão de demanda para os próximos 30 dias

### 2. **Otimização de Preços** 💰
- **Algoritmo**: Análise de Elasticidade de Preço
- **Dados**: Relação preço-quantidade das vendas históricas
- **Saída**: Preço ótimo para maximizar receita

### 3. **Detecção de Anomalias** ⚠️
- **Algoritmo**: Isolation Forest
- **Dados**: Padrões de vendas diárias
- **Saída**: Identificação de vendas anômalas

### 4. **Otimização de Estoque** 📦
- **Algoritmo**: Cálculo de Ponto de Reposição
- **Dados**: Demanda prevista + lead time + estoque de segurança
- **Saída**: Recomendações de estoque ótimo

## 🔧 Como Usar

### 1. **Instalação das Dependências**
```bash
pip install -r requirement.txt
```

### 2. **Geração de Dados Iniciais** (Opcional)
- Acesse a aba **Insights**
- Clique em **"Generate Initial Data (30 days)"**
- Isso só cria dados se não existirem vendas no sistema

### 3. **Análise ML de Produtos**
- Vá para a aba **Products**
- Clique no ícone **🧠 (Brain)** ao lado de qualquer produto
- O sistema automaticamente:
  - Muda para a aba **Insights**
  - Seleciona a aba **🤖 ML Insights**
  - Carrega todas as análises ML para o produto

### 4. **Visualização dos Resultados**
Na aba **🤖 ML Insights**, você verá:

#### 📈 **Demand Prediction**
- Demanda média diária prevista
- Demanda total para 30 dias
- Acurácia do modelo
- Número de pontos de dados históricos

#### 💰 **Price Optimization**
- Preço atual vs. preço ótimo
- Potencial de aumento de receita
- Acurácia do modelo de elasticidade

#### 📦 **Stock Optimization**
- Estoque atual vs. estoque ótimo
- Ponto de reposição calculado
- Cobertura de estoque em dias
- Recomendações específicas

#### ⚠️ **Anomaly Detection**
- Número de anomalias detectadas
- Datas com vendas anômalas
- Pontuação de anomalia

## 📊 Requisitos de Dados

### **Mínimo para Previsão de Demanda**
- **14 dias** de dados de vendas
- Pelo menos **1 venda** por dia em média

### **Mínimo para Otimização de Preços**
- **2 variações de preço** diferentes
- Vendas em cada faixa de preço

### **Mínimo para Detecção de Anomalias**
- **7 dias** de dados de vendas
- Padrões de vendas consistentes

## 🎯 Algoritmos Detalhados

### **Previsão de Demanda**
```python
# Features utilizadas:
- dia_semana (0-6)
- mes (1-12)
- lag_1 (venda do dia anterior)
- lag_7 (venda de 7 dias atrás)
- rolling_mean_7 (média móvel 7 dias)
- rolling_mean_14 (média móvel 14 dias)
- rolling_std_7 (desvio padrão móvel 7 dias)
```

### **Otimização de Preços**
```python
# Análise de elasticidade:
elasticity = model.coef_[0] * (current_price / current_quantity)

# Cenários de preço testados:
price_range = [current_price * 0.7, current_price * 1.5]
```

### **Detecção de Anomalias**
```python
# Features para anomalias:
- total_quantity (quantidade total vendida)
- sales_count (número de vendas)
- quantity_std (desvio padrão das quantidades)
- total_revenue (receita total)
- avg_revenue (receita média)
```

## 🔍 Interpretação dos Resultados

### **Acurácia do Modelo**
- **> 0.7**: Excelente
- **0.5 - 0.7**: Boa
- **0.3 - 0.5**: Regular
- **< 0.3**: Precisa de mais dados

### **Recomendações de Estoque**
- **Critical**: Produto sem estoque
- **High**: Abaixo do ponto de reposição
- **Medium**: Baixa cobertura de estoque
- **Low**: Estoque excessivo

### **Otimização de Preços**
- **> 10%**: Alto potencial de aumento de receita
- **5-10%**: Potencial moderado
- **< 5%**: Preço já está otimizado

## 🛠️ Endpoints da API

### **Previsão de Demanda**
```http
GET /insights/ml/demand-prediction/{product_id}?days_ahead=30
```

### **Otimização de Preços**
```http
GET /insights/ml/price-optimization/{product_id}
```

### **Detecção de Anomalias**
```http
GET /insights/ml/anomaly-detection?product_id={product_id}
```

### **Otimização de Estoque**
```http
GET /insights/ml/stock-optimization/{product_id}
```

### **Insights Completos**
```http
GET /insights/ml/product-insights/{product_id}
```

## 📈 Melhorias Futuras

### **Algoritmos Avançados**
- **ARIMA/Prophet** para séries temporais
- **Random Forest** para previsões mais robustas
- **Neural Networks** para padrões complexos

### **Funcionalidades Adicionais**
- **Segmentação de clientes** (K-means)
- **Recomendações de produtos** (Collaborative Filtering)
- **Previsão de sazonalidade**
- **Análise de sentimentos** de feedback

### **Integrações**
- **APIs externas** para dados de mercado
- **Dashboards** em tempo real
- **Alertas automáticos** por email/SMS

## 🔒 Segurança e Privacidade

- ✅ **Dados locais**: Tudo fica no seu SQLite
- ✅ **Sem envio externo**: Nenhum dado é enviado para APIs externas
- ✅ **Processamento local**: Todos os cálculos são feitos localmente
- ✅ **Controle total**: Você tem controle completo sobre os dados

## 🐛 Troubleshooting

### **"Insufficient data"**
- Adicione mais vendas ao sistema
- Use o gerador de dados iniciais
- Aguarde acumular mais dados históricos

### **"Model accuracy low"**
- Verifique se há padrões consistentes nas vendas
- Considere remover outliers
- Adicione mais produtos com vendas

### **"No predictions available"**
- Certifique-se de que o produto tem vendas
- Verifique se as vendas são recentes (últimos 180 dias)
- Confirme que o produto não foi deletado

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se todas as dependências estão instaladas
2. Confirme que o banco SQLite está funcionando
3. Verifique os logs do servidor para erros
4. Teste com dados iniciais primeiro

---

**🎉 Parabéns!** Seu sistema agora tem Machine Learning real funcionando com dados do seu negócio!
