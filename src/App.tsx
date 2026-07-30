import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Sidebar from './layout/Sidebar';
import Topbar from './layout/Topbar';
import PatientHeader from './layout/PatientHeader';
import PipelineTracker from './layout/PipelineTracker';
import ApiHealthStatus from './components/ApiHealthStatus';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Patients = React.lazy(() => import('./pages/Patients'));
const PatientCase = React.lazy(() => import('./pages/PatientCase'));
const Imaging = React.lazy(() => import('./pages/Imaging'));
const Labs = React.lazy(() => import('./pages/Labs'));
const RiskEngine = React.lazy(() => import('./pages/RiskEngine'));
const AutonomousIntervention = React.lazy(() => import('./pages/AutonomousIntervention'));
const AutonomousPrevention = React.lazy(() => import('./pages/AutonomousPrevention'));
const CareCoordination = React.lazy(() => import('./pages/CareCoordination'));
const Reports = React.lazy(() => import('./pages/Reports'));
const ResearchMode = React.lazy(() => import('./pages/ResearchMode'));
const PredictionDetail = React.lazy(() => import('./pages/PredictionDetail'));
const DatasetDetail = React.lazy(() => import('./pages/DatasetDetail'));
const AuditLogs = React.lazy(() => import('./pages/AuditLogs'));
const Administration = React.lazy(() => import('./pages/Administration'));

/** Clinical mock routes that show John Smith PatientHeader + PipelineTracker.
 *  API-backed routes intentionally excluded. */
const PATIENT_CONTEXT_ROUTES = [
  '/',
  '/labs',
  '/risk-engine',
  '/intervention',
  '/prevention',
  '/care',
  '/reports',
];

const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
      <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse [animation-delay:0.15s]" />
      <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse [animation-delay:0.3s]" />
    </div>
  </div>
);

const App: React.FC = () => {
  const location = useLocation();
  const showPatientContext = PATIENT_CONTEXT_ROUTES.includes(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1220]">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        {showPatientContext && <PatientHeader />}
        {showPatientContext && <PipelineTracker />}

        <main
          className="flex-1 overflow-y-auto bg-[#0B1220]"
          style={{
            background: 'linear-gradient(180deg, #0B1220 0%, #0d1526 100%)',
          }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/patients/:patientId" element={<PatientCase />} />
                <Route path="/imaging" element={<Imaging />} />
                <Route path="/labs" element={<Labs />} />
                <Route path="/risk-engine" element={<RiskEngine />} />
                <Route path="/intervention" element={<AutonomousIntervention />} />
                <Route path="/prevention" element={<AutonomousPrevention />} />
                <Route path="/care" element={<CareCoordination />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/research" element={<ResearchMode />} />
                <Route path="/predictions/:predictionId" element={<PredictionDetail />} />
                <Route path="/datasets/:datasetId" element={<DatasetDetail />} />
                <Route path="/audit" element={<AuditLogs />} />
                <Route path="/administration" element={<Administration />} />
              </Routes>
            </AnimatePresence>
          </Suspense>

          <footer className="px-6 py-4 border-t border-[#1E2A3D] flex items-center gap-4 flex-wrap">
            <span className="text-[#5E6E85] text-xs">
              &copy; 2026 Scorpius Health
            </span>
            <span className="text-[#1E2A3D] text-xs select-none">|</span>
            <span className="text-[#5E6E85] text-xs">
              Environment: <span className="text-[#93A1B5]">Pilot</span>
            </span>
            <span className="text-[#1E2A3D] text-xs select-none">|</span>
            <span className="text-[#5E6E85] text-xs">
              Version <span className="text-[#93A1B5]">v1.0.0</span>
            </span>
            <span className="text-[#1E2A3D] text-xs select-none">|</span>
            <ApiHealthStatus />
            <span className="text-[#1E2A3D] text-xs select-none">|</span>
            <span className="text-[#5E6E85] text-xs">HIPAA Ready</span>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
