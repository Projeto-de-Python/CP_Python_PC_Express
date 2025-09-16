// Exemplo de hook complexo que pode ser aceitável
import React, { useEffect, useMemo, useState } from 'react';

const ComplexDataProcessor = ({ data, config }) => {
  // Hook complexo mas justificado - processamento de dados pesado
  const processedData = useMemo(() => {
    // Este hook pode ter 100+ linhas mas é justificado
    // pois processa dados complexos de forma otimizada

    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Fase 1: Limpeza e normalização dos dados
    const cleanedData = data.map(item => {
      // Remove campos vazios
      const cleaned = {};
      Object.keys(item).forEach(key => {
        if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
          cleaned[key] = item[key];
        }
      });
      return cleaned;
    });

    // Fase 2: Aplicação de filtros
    let filteredData = cleanedData;
    if (config.filters) {
      filteredData = cleanedData.filter(item => {
        return config.filters.every(filter => {
          switch (filter.type) {
            case 'range':
              return item[filter.field] >= filter.min && item[filter.field] <= filter.max;
            case 'exact':
              return item[filter.field] === filter.value;
            case 'contains':
              return item[filter.field]?.toString().toLowerCase().includes(filter.value.toLowerCase());
            case 'date':
              const itemDate = new Date(item[filter.field]);
              const filterDate = new Date(filter.value);
              return itemDate >= filterDate;
            default:
              return true;
          }
        });
      });
    }

    // Fase 3: Aplicação de transformações
    let transformedData = filteredData;
    if (config.transformations) {
      transformedData = filteredData.map(item => {
        let transformed = { ...item };

        config.transformations.forEach(transform => {
          switch (transform.type) {
            case 'calculate':
              if (transform.formula) {
                try {
                  // Cálculo seguro usando eval (em ambiente controlado)
                  const result = eval(transform.formula.replace(/\{(\w+)\}/g, (match, field) => {
                    return transformed[field] || 0;
                  }));
                  transformed[transform.field] = result;
                } catch (error) {
                  console.warn('Erro no cálculo:', error);
                }
              }
              break;
            case 'format':
              if (transform.format === 'currency') {
                transformed[transform.field] = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(transformed[transform.field]);
              } else if (transform.format === 'date') {
                transformed[transform.field] = new Date(transformed[transform.field]).toLocaleDateString('pt-BR');
              }
              break;
            case 'aggregate':
              // Agregação de dados relacionados
              const relatedItems = transformedData.filter(related =>
                related[transform.groupBy] === transformed[transform.groupBy]
              );
              transformed[transform.field] = relatedItems.reduce((sum, related) =>
                sum + (related[transform.aggregateField] || 0), 0
              );
              break;
          }
        });

        return transformed;
      });
    }

    // Fase 4: Aplicação de ordenação
    let sortedData = transformedData;
    if (config.sorting) {
      sortedData = [...transformedData].sort((a, b) => {
        const field = config.sorting.field;
        const direction = config.sorting.direction || 'asc';

        let aVal = a[field];
        let bVal = b[field];

        // Tratamento de tipos
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (direction === 'desc') {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        } else {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
      });
    }

    // Fase 5: Aplicação de paginação
    let paginatedData = sortedData;
    if (config.pagination) {
      const { page, pageSize } = config.pagination;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      paginatedData = sortedData.slice(startIndex, endIndex);
    }

    // Fase 6: Adição de metadados
    const result = {
      data: paginatedData,
      metadata: {
        totalItems: sortedData.length,
        totalPages: config.pagination ? Math.ceil(sortedData.length / config.pagination.pageSize) : 1,
        currentPage: config.pagination?.page || 1,
        hasNextPage: config.pagination ? (config.pagination.page * config.pagination.pageSize) < sortedData.length : false,
        hasPreviousPage: config.pagination ? config.pagination.page > 1 : false,
        processingTime: Date.now() - startTime
      }
    };

    return result;
  }, [data, config]);

  // Hook de efeito complexo mas justificado - sincronização com API
  useEffect(() => {
    // Este useEffect pode ser grande mas é justificado
    // pois gerencia sincronização complexa com múltiplas APIs

    if (!processedData.data || processedData.data.length === 0) {
      return;
    }

    const syncWithAPIs = async () => {
      try {
        // Sincronização com API principal
        const mainAPIResponse = await fetch('/api/data/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            data: processedData.data,
            metadata: processedData.metadata
          })
        });

        if (!mainAPIResponse.ok) {
          throw new Error(`API principal falhou: ${mainAPIResponse.status}`);
        }

        const mainResult = await mainAPIResponse.json();

        // Sincronização com API de cache
        const cacheAPIResponse = await fetch('/api/cache/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Cache-Key': `processed_data_${Date.now()}`
          },
          body: JSON.stringify({
            key: `processed_data_${Date.now()}`,
            value: processedData,
            ttl: 3600 // 1 hora
          })
        });

        if (!cacheAPIResponse.ok) {
          console.warn('Cache API falhou, continuando sem cache');
        }

        // Sincronização com API de analytics
        const analyticsAPIResponse = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event: 'data_processed',
            properties: {
              itemCount: processedData.data.length,
              processingTime: processedData.metadata.processingTime,
              filters: config.filters?.length || 0,
              transformations: config.transformations?.length || 0
            }
          })
        });

        if (!analyticsAPIResponse.ok) {
          console.warn('Analytics API falhou, continuando sem analytics');
        }

        // Atualização do estado local
        setSyncStatus('success');
        setLastSyncTime(Date.now());
        setSyncErrors([]);

      } catch (error) {
        console.error('Erro na sincronização:', error);
        setSyncStatus('error');
        setSyncErrors(prev => [...prev, {
          timestamp: Date.now(),
          error: error.message,
          api: 'sync'
        }]);
      }
    };

    // Debounce para evitar muitas chamadas
    const timeoutId = setTimeout(syncWithAPIs, 500);

    return () => clearTimeout(timeoutId);
  }, [processedData, config]);

  // Estados para controle
  const [syncStatus, setSyncStatus] = useState('idle');
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncErrors, setSyncErrors] = useState([]);

  return (
    <div>
      {/* Renderização dos dados processados */}
      {processedData.data.map(item => (
        <div key={item.id}>
          {/* Renderização do item */}
        </div>
      ))}
    </div>
  );
};

export default ComplexDataProcessor;
