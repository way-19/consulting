import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useMessageTranslation } from '../hooks/useMessageTranslation';
import ConsultantAccountingModule from '../components/consultant/accounting/ConsultantAccountingModule';
import ConsultantDashboardLayout from '../components/consultant/ConsultantDashboardLayout';
import PerformanceHub from '../components/consultant/dashboard/PerformanceHub';
import LegacyOrderManager from '../components/consultant/dashboard/LegacyOrderManager';
import QuickActions from '../components/consultant/dashboard/QuickActions';
import CountryBasedClients from '../components/consultant/dashboard/CountryBasedClients';
import CustomServiceManager from '../components/consultant/dashboard/CustomServiceManager';
import ConsultantMessagingModule from '../components/consultant/messaging/ConsultantMessagingModule';

const ConsultantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [consultant, setConsultant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Use translation hook
  const { processingTranslations } = useMessageTranslation(consultant?.id || '', consultant?.language || 'en');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        {/* Custom Service Manager */}
        <CustomServiceManager consultantId={consultant.id} />
         
        {/* Messaging Module */}
        <ConsultantMessagingModule consultantId={consultant.id} />
         
        {/* Accounting Module */}
        <ConsultantAccountingModule consultantId={consultant.id} />
         
        if (!session) {
          navigate('/login');
          return;
        }
      }
      </div>
    }
    </ConsultantDashboardLayout>
  }
  );
};

export default ConsultantDashboard;