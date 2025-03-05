import React from 'react'
import {
    ArrowUpRight,
  } from "lucide-react"
import Link from 'next/link';


  export default function MonthlyBudget (){
    // TODO: INTEGRACAO COM API DE VALORES, PORCENTAGENS
    const dataMockup = {
        gastos: 64,
        limiteOrcamento: 5000,
        gastoAtual: 3200,
    }

     // Função para formatar valores monetários
  const formatValue = (value: number) => {
    if (value === 0) {
      return 'R$ 0,00';
    }
    const formattedValue = value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    return `R$ ${formattedValue}`;
  };
    return (
        <div className='bg-white rounded-lg shadow p-6'>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Orçamento Mensal</h3>
                <span className="text-gray-500">Maio 2025</span>
            </div>
            <div className="mt-4">
                <p className="text-xs texty-gray-500 mb-1">Gasto: {dataMockup.gastos}%</p>
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${dataMockup.gastos}%`}}></div>
                </div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
                <span>{formatValue(dataMockup.gastoAtual)} de {formatValue(dataMockup.limiteOrcamento)}</span>
                <span>Restante: {formatValue(dataMockup.limiteOrcamento - dataMockup.gastoAtual)}</span>
            </div>
            <div className="mt-4">
                <Link href="/budget" className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center'>
                    Ver detalhes do orçamento
                    <ArrowUpRight className="w-4 h-4 ml-1" /> 
                </Link>

            </div>
        </div>
    )
  }