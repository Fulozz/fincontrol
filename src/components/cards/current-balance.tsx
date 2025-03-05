import React from 'react'
import {
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
  } from "lucide-react"


export default function CurrentBalance (){
    // TODO: INTEGRACAO COM A API, E CALCULOS
    return(
        <div className='bg-white rounded-lg shadow p-6'>
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-500">Saldo Atual</h3>
                        <span className="p-2 bg-green-100 rounded-full">
                            <Wallet className="w-5 h-5 text-green-600" />
                        </span>
                    </div>
                    {/* TODO: Saldo atual já com o calculo total do backend, armazenar de uma maneria que sempre que houver alterações ficar saldo de maneira simples */}
                    <p className="text-2xl font-bold text-gray-900 mt-2">R$ 12.450,00</p>
                    <div className='flex items-center mt-2 text-sm'>
                        <ArrowUpRight className='w-4 h-4 text-green-500 mr-1' />
                        <span className="text-green-500 font-medium">+5.2%</span>
                        <span className='text-gray-500 ml-1' >do mês anterior</span>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-gray-500 mb-1">Meta de economia: 39%</p>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            {/* TODO: width de acordo com o calculo de % de economia */}
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "39%" }}></div>
                    </div>
                        <p className="text-xs text-gray-500 text-right mt-1">Meta: 20%</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="border border-gray-200 rounded-md p-2">
                            <div className="flex items-center text-green-600">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            <span className="text-xs">Receitas</span>
                            </div>
                            <p className="text-sm font-medium mt-1">R$ 8.500</p>
                        </div>
                        <div className="border border-gray-200 rounded-md p-2">
                            <div className="flex items-center text-red-600">
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                            <span className="text-xs">Despesas</span>
                            </div>
                            <p className="text-sm font-medium mt-1">R$ 5.200</p>
                        </div>
                    </div>
                </div>
    )
}