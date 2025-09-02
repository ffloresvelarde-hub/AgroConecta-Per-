import React from 'react';
import { Module } from '../types.ts';
import Welcome from '../modules/Welcome.tsx';
import MercadoNegocio from '../modules/MercadoNegocio.tsx';
import SaberAgricola from '../modules/SaberAgricola.tsx';
import CreditoProteccion from '../modules/CreditoProteccion.tsx';
import ClimaInteligente from '../modules/ClimaInteligente.tsx';
import RedAgro from '../modules/RedAgro.tsx';
import LogisticaExportacion from '../modules/LogisticaExportacion.tsx';

interface DashboardProps {
  selectedModule: Module | null;
}

const Dashboard: React.FC<DashboardProps> = ({ selectedModule }) => {
  const renderModule = () => {
    switch (selectedModule) {
      case Module.MercadoNegocio:
        return <MercadoNegocio />;
      case Module.SaberAgricola:
        return <SaberAgricola />;
      case Module.CreditoProteccion:
        return <CreditoProteccion />;
      case Module.ClimaInteligente:
        return <ClimaInteligente />;
      case Module.RedAgro:
        return <RedAgro />;
      case Module.LogisticaExportacion:
        return <LogisticaExportacion />;
      default:
        return <Welcome />;
    }
  };

  return <div>{renderModule()}</div>;
};

export default Dashboard;