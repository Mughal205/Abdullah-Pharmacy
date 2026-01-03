
import React, { useState, useEffect } from 'react';
import { AppView, Medicine, Sale, SaleItem } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import AIAssistant from './components/AIAssistant';
import Login from './components/Login';
import Reports from './components/Reports';
import Footer from './components/Footer';

// Initial Mock Data
const INITIAL_INVENTORY: Medicine[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Painkillers', batchNumber: 'BAT-001', expiryDate: '2026-12-31', quantity: 250, price: 5.50, lowStockThreshold: 50, manufacturer: 'HealthPlus' },
  { id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotics', batchNumber: 'BAT-002', expiryDate: '2025-08-15', quantity: 120, price: 12.00, lowStockThreshold: 30, manufacturer: 'GlobalPharma' },
  { id: '3', name: 'Vitamin C 1000mg', category: 'Vitamins', batchNumber: 'BAT-003', expiryDate: '2024-11-20', quantity: 45, price: 8.75, lowStockThreshold: 50, manufacturer: 'NutriSafe' },
  { id: '4', name: 'Ibuprofen 400mg', category: 'Painkillers', batchNumber: 'BAT-004', expiryDate: '2027-02-10', quantity: 15, price: 7.20, lowStockThreshold: 20, manufacturer: 'HealthPlus' },
];

const INITIAL_SALES: Sale[] = [
  { id: 'INV-102501', timestamp: new Date(Date.now() - 86400000).toISOString(), totalAmount: 45.00, items: [{ medicineId: '1', name: 'Paracetamol', quantity: 2, priceAtSale: 5.50 }], customerName: 'Ahmed Ali' },
  { id: 'INV-102502', timestamp: new Date().toISOString(), totalAmount: 120.00, items: [{ medicineId: '2', name: 'Amoxicillin', quantity: 10, priceAtSale: 12.00 }], customerName: 'Zoya Khan' },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [inventory, setInventory] = useState<Medicine[]>(INITIAL_INVENTORY);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);

  // State Persistence Simulation
  useEffect(() => {
    const savedInv = localStorage.getItem('pharma_inventory');
    const savedSales = localStorage.getItem('pharma_sales');
    const authStatus = localStorage.getItem('pharma_auth');
    
    if (savedInv) setInventory(JSON.parse(savedInv));
    if (savedSales) setSales(JSON.parse(savedSales));
    if (authStatus === 'true') setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('pharma_inventory', JSON.stringify(inventory));
    localStorage.setItem('pharma_sales', JSON.stringify(sales));
    localStorage.setItem('pharma_auth', isLoggedIn.toString());
  }, [inventory, sales, isLoggedIn]);

  const handleLogin = (success: boolean) => {
    setIsLoggedIn(success);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView(AppView.DASHBOARD);
  };

  const handleAddMedicine = (newMed: Omit<Medicine, 'id'>) => {
    const med: Medicine = {
      ...newMed,
      id: Math.random().toString(36).substr(2, 9),
      batchNumber: `BAT-${Math.floor(Math.random() * 900) + 100}`
    };
    setInventory([...inventory, med]);
  };

  const handleUpdateMedicine = (id: string, updates: Partial<Medicine>) => {
    setInventory(inventory.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const handleDeleteMedicine = (id: string) => {
    if (window.confirm('Are you sure you want to remove this medicine?')) {
      setInventory(inventory.filter(m => m.id !== id));
    }
  };

  const handleNewSale = (items: SaleItem[], customerName: string) => {
    const total = items.reduce((sum, i) => sum + (i.priceAtSale * i.quantity), 0);
    const newSale: Sale = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      items,
      totalAmount: total,
      customerName
    };

    // Update stock levels
    const updatedInventory = inventory.map(med => {
      const soldItem = items.find(i => i.medicineId === med.id);
      if (soldItem) {
        return { ...med, quantity: Math.max(0, med.quantity - soldItem.quantity) };
      }
      return med;
    });

    setInventory(updatedInventory);
    setSales([...sales, newSale]);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return <Dashboard inventory={inventory} sales={sales} />;
      case AppView.INVENTORY:
        return (
          <Inventory 
            inventory={inventory} 
            onAdd={handleAddMedicine} 
            onUpdate={handleUpdateMedicine} 
            onDelete={handleDeleteMedicine}
          />
        );
      case AppView.SALES:
        return (
          <Sales 
            inventory={inventory} 
            onSale={handleNewSale} 
            salesHistory={sales}
          />
        );
      case AppView.AI_ASSISTANT:
        return <AIAssistant inventory={inventory} sales={sales} />;
      case AppView.REPORTS:
        return <Reports sales={sales} />;
      default:
        return <Dashboard inventory={inventory} sales={sales} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={view} setView={setView} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-7xl mx-auto flex flex-col min-h-full">
          <div className="flex-1">
            {renderView()}
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default App;
