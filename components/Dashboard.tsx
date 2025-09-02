
import React from 'react';
import { Module } from '../types';
import Welcome from '../modules/Welcome';
import MercadoNegocio from '../modules/MercadoNegocio';
import SaberAgricola from '../modules/SaberAgricola';
import CreditoProteccion from '../modules/CreditoProteccion';
import ClimaInteligente from '../modules/ClimaInteligente';
import RedAgro from '../modules/RedAgro';
import LogisticaExportacion from '../modules/LogisticaExportacion';

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
