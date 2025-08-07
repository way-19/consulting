import React from 'react';
import ConsultantAccountingModule from '../../../components/consultant/accounting/ConsultantAccountingModule';

const Accounting = () => {
  const authUser = JSON.parse(localStorage.getItem('user') || '{}');
  const consultantId = authUser.id || '';

  return <ConsultantAccountingModule consultantId={consultantId} />;
};

export default Accounting;
