import React from 'react';

interface PropsResumoCarrinho {
  total: number;
}

const ResumoCarrinho: React.FC<PropsResumoCarrinho> = ({ total }) => {
  return (
    <div className="flex items-center justify-end mt-6 p-4 bg-amber-50 rounded-lg shadow-sm">
      <span className="text-xl font-bold font-adlam text-amber-900">
        🛒 Total: R$  {total.toFixed(2).replace('.', ',')}
      </span>
    </div>
  );
};

export default ResumoCarrinho;