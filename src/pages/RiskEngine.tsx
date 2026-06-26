import React, { useState } from 'react';
import { Brain, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import PageContainer from '../layout/PageContainer';
import { Card, RiskDonut, KeyValueRow, ProgressBar, ConfidenceMeter } from '../components';
import { riskDrivers, riskTrajectory } from '../data/patient';
import { modelCard, whatIfDefaults } from '../data/riskEngine';
import { recomputeRisk } from '../lib/format';

type WhatIfState = {
  imaging: number;
  ip10: number;
  symptoms: number;
  cbc: number;
  esrCrp: number;
  smearPositive: boolean;
  culturePositive: boolean;
};

const MISSING_INPUTS = [
  'Sputum Smear Result',
  'Mycobacterial Culture',
  'CT Chest (with contrast)',
];

function projectedColor(score: number): string {
  if (score >= 80) return '#F0476A';
  if (score >= 60) return '#F4A638';
  if (score >= 35) return '#6B8AFE';
  return '#36C28B';
}

export default function RiskEngine() {
  const [currentValues, setCurrentValues] = useState<WhatIfState>({
    imaging: Math.round(whatIfDefaults.imagingProbability * 30),
    ip10: Math.round((whatIfDefaults.ip10Value / 1000) * 20),
    symptoms: Math.round(whatIfDefaults.symptomSeverity * 15),
    cbc: Math.round(whatIfDefaults.cbcAbnormality * 12),
    esrCrp: Math.round(whatIfDefaults.esrCrpElevation * 10),
    smearPositive: whatIfDefaults.smearPositive,
    culturePositive: whatIfDefaults.culturePositive,
  });

  const [projectedScore, setProjectedScore] = useState<number>(
    recomputeRisk({
      imaging: whatIfDefaults.imagingProbability,
      ip10: whatIfDefaults.ip10Value,
      symptoms: whatIfDefaults.symptomSeverity,
      cbc: whatIfDefaults.cbcAbnormality,
      esrCrp: whatIfDefaults.esrCrpElevation,
      smearPositive: whatIfDefaults.smearPositive,
      culturePositive: whatIfDefaults.culturePositive,
    })
  );

  function handleSlider(key: keyof WhatIfState, rawValue: number, max: number) {
    const newValues = { ...currentValues, [key]: rawValue };
    setCurrentValues(newValues);
    setProjectedScore(
      recomputeRisk({
        imaging: newValues.imaging / 30,
        ip10: (newValues.ip10 / 20) * 1000,
        symptoms: newValues.symptoms / 15,
        cbc: newValues.cbc / 12,
        esrCrp: newValues.esrCrp / 10,
        smearPositive: newValues.smearPositive,
        culturePositive: newValues.culturePositive,
      })
    );
  }

  function handleCheckbox(key: 'smearPositive' | 'culturePositive', checked: boolean) {
    const newValues = { ...currentValues, [key]: checked };
    setCurrentValues(newValues);
    setProjectedScore(
      recomputeRisk({
        imaging: newValues.imaging / 30,
        ip10: (newValues.ip10 / 20) * 1000,
        symptoms: newValues.symptoms / 15,
        cbc: newValues.cbc / 12,
        esrCrp: newValues.esrCrp / 10,
        smearPositive: newValues.smearPositive,
        culturePositive: newValues.culturePositive,
      })
    );
  }

  const barData = riskDrivers.map((d) => ({
    name: d.factor,
    value: Math.abs(d.contribution),
    direction: d.direction,
  }));

  const pScore = projectedColor(projectedScore);

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Brain size={20} color="#3B82F6" />
        <div>
          <h2 className="text-[20px] font-semibold leading-tight" style={{ color: '#E8EEF7' }}>
            Risk Engine
          </h2>
          <p className="text-[13px] mt-0.5" style={{ color: '#5E6E85' }}>
            AI explainability — understand every factor contributing to the current risk score.
          </p>
        </div>
      </div>

      {/* Top 3 cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* LEFT — Risk Donut */}
        <Card>
          <div className="flex flex-col items-center gap-4">
            <RiskDonut value={82} size={160} label="RISK" subtitle="Current" />
            <div className="text-center w-full">
              <div
                className="text-[28px] font-bold leading-none tabular-nums"
                style={{ color: '#F0476A', fontVariantNumeric: 'tabular-nums' }}
              >
                82%
              </div>
              <div className="text-[13px] mt-1" style={{ color: '#5E6E85' }}>
                Severity: Severe Suspicion
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: '#5E6E85' }}>
                Last updated: 06 May 2026 10:24 AM
              </div>
            </div>
          </div>
        </Card>

        {/* CENTER — Feature Contribution */}
        <Card title="Feature Contribution">
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={barData}
                margin={{ top: 0, right: 12, bottom: 0, left: 0 }}
              >
                <CartesianGrid horizontal={false} stroke="#1E2A3D" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[0, 30]}
                  tick={{ fill: '#5E6E85', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  tick={{ fill: '#93A1B5', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121C2E',
                    border: '1px solid #1E2A3D',
                    borderRadius: 8,
                    color: '#E8EEF7',
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v} pts`, 'Contribution']}
                />
                <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                  {barData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.direction === 'positive' ? '#F0476A' : '#36C28B'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* RIGHT — Model Card */}
        <Card title="Model Card">
          <div className="text-sm font-semibold mb-3" style={{ color: '#E8EEF7' }}>
            {modelCard.name}
          </div>
          <KeyValueRow label="Version" value="v1.3.2" />
          <KeyValueRow label="AUROC" value={modelCard.auroc.toFixed(3)} valueColor="#36C28B" />
          <KeyValueRow label="Sensitivity" value={`${(modelCard.sensitivity * 100).toFixed(1)}%`} />
          <KeyValueRow label="Specificity" value={`${(modelCard.specificity * 100).toFixed(1)}%`} />
          <KeyValueRow label="Trained on" value="847k encounters" />
          <KeyValueRow label="Last updated" value={modelCard.lastUpdated} />

          <div className="mt-4">
            <div
              className="text-[11px] uppercase tracking-widest font-semibold mb-2"
              style={{ color: '#5E6E85' }}
            >
              Inputs
            </div>
            <div className="flex flex-wrap gap-1.5">
              {modelCard.inputs.slice(0, 7).map((inp) => (
                <span
                  key={inp}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ backgroundColor: '#3B82F614', color: '#6B8AFE' }}
                >
                  {inp}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* What-If Simulator */}
      <Card
        title="What-If Simulator"
        className="mb-4"
        action={
          <span className="text-[12px]" style={{ color: '#5E6E85' }}>
            For illustration only — does not affect clinical record
          </span>
        }
      >
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Imaging slider */}
          {(
            [
              { key: 'imaging', label: 'CXR AI Score', max: 30, unit: 'pts' },
              { key: 'ip10', label: 'IP-10 Contribution', max: 20, unit: 'pts' },
              { key: 'symptoms', label: 'Symptom Severity', max: 15, unit: 'pts' },
              { key: 'cbc', label: 'CBC Abnormality', max: 12, unit: 'pts' },
              { key: 'esrCrp', label: 'ESR / CRP', max: 10, unit: 'pts' },
            ] as { key: keyof WhatIfState; label: string; max: number; unit: string }[]
          ).map(({ key, label, max, unit }) => (
            <div key={key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] uppercase tracking-widest font-semibold"
                  style={{ color: '#5E6E85' }}
                >
                  {label}
                </span>
                <span
                  className="text-xs font-semibold tabular-nums"
                  style={{ color: '#E8EEF7', fontVariantNumeric: 'tabular-nums' }}
                >
                  {currentValues[key] as number} {unit}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={max}
                value={currentValues[key] as number}
                onChange={(e) => handleSlider(key, Number(e.target.value), max)}
                className="w-full accent-[#3B82F6]"
                style={{ accentColor: '#3B82F6' }}
              />
            </div>
          ))}

          {/* Smear positive checkbox */}
          <div className="flex flex-col justify-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={currentValues.smearPositive}
                onChange={(e) => handleCheckbox('smearPositive', e.target.checked)}
                className="w-4 h-4 rounded accent-[#3B82F6]"
                style={{ accentColor: '#3B82F6' }}
              />
              <span className="text-[12px]" style={{ color: '#93A1B5' }}>
                Smear Positive (+10 pts)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={currentValues.culturePositive}
                onChange={(e) => handleCheckbox('culturePositive', e.target.checked)}
                className="w-4 h-4 rounded accent-[#3B82F6]"
                style={{ accentColor: '#3B82F6' }}
              />
              <span className="text-[12px]" style={{ color: '#93A1B5' }}>
                Culture Positive (+12 pts)
              </span>
            </label>
          </div>

          {/* Result display */}
          <div
            className="col-span-4 flex items-center justify-center gap-6 py-4 rounded-xl"
            style={{ backgroundColor: '#0F1828' }}
          >
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-widest font-semibold mb-1" style={{ color: '#5E6E85' }}>
                Current
              </div>
              <div
                className="text-[40px] font-bold tabular-nums leading-none"
                style={{ color: '#F0476A', fontVariantNumeric: 'tabular-nums' }}
              >
                82
              </div>
            </div>
            <div style={{ color: '#5E6E85', fontSize: 28 }}>→</div>
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-widest font-semibold mb-1" style={{ color: '#5E6E85' }}>
                Projected
              </div>
              <div
                className="text-[40px] font-bold tabular-nums leading-none transition-colors"
                style={{ color: pScore, fontVariantNumeric: 'tabular-nums' }}
              >
                {projectedScore}
              </div>
            </div>
            <div className="ml-4">
              <span
                className="text-[13px] font-semibold"
                style={{ color: projectedScore > 82 ? '#F0476A' : projectedScore < 82 ? '#36C28B' : '#5E6E85' }}
              >
                {projectedScore > 82 ? `↑ +${projectedScore - 82} pts` : projectedScore < 82 ? `↓ −${82 - projectedScore} pts` : 'No change'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Risk Trajectory */}
      <Card title="Risk Trajectory" className="mb-4">
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={riskTrajectory}
              margin={{ top: 8, right: 24, bottom: 0, left: 0 }}
            >
              <CartesianGrid stroke="#1E2A3D" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#5E6E85', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#5E6E85', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#121C2E',
                  border: '1px solid #1E2A3D',
                  borderRadius: 8,
                  color: '#E8EEF7',
                  fontSize: 12,
                }}
                formatter={(v: number) => [`${v}`, 'Risk Score']}
              />
              <ReferenceLine
                y={75}
                stroke="#F0476A"
                strokeDasharray="4 4"
                label={{
                  value: 'High Risk Threshold',
                  position: 'insideTopRight',
                  fill: '#F0476A',
                  fontSize: 11,
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Missing Inputs */}
      <Card title="Missing Inputs">
        <div className="flex flex-col gap-2 mb-4">
          {MISSING_INPUTS.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
              style={{ backgroundColor: '#0F1828' }}
            >
              <AlertTriangle size={14} style={{ color: '#F4A638', flexShrink: 0 }} />
              <span className="text-[13px] flex-1" style={{ color: '#93A1B5' }}>
                {item}
              </span>
              <span
                className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: '#F4A63822', color: '#F4A638' }}
              >
                Pending
              </span>
            </div>
          ))}
        </div>
        <div className="text-[13px] font-semibold" style={{ color: '#36C28B' }}>
          Expected confidence if completed: 96%
        </div>
      </Card>
    </PageContainer>
  );
}
