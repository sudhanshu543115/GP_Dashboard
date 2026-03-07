import React, { useState } from 'react';
import { Plus, Trash2, Download, Send, FileText, User, Calendar, CreditCard } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const BillGenerate = () => {
    const [clientInfo, setClientInfo] = useState({
        name: '',
        email: '',
        address: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
    });

    const [items, setItems] = useState([
        { id: 1, description: '', quantity: 1, price: 0 }
    ]);

    const addItem = () => {
        setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxRate = 0.18; // 18% GST
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">Generate Bill</h2>
                    <p className="text-text-muted text-sm">Create and send professional invoices to your clients.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-text-primary rounded-xl transition-all border border-dark-600">
                        <Download className="w-4 h-4" />
                        <span>Save Draft</span>
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all shadow-lg shadow-primary/20">
                        <Send className="w-4 h-4" />
                        <span>Generate & Send</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Client & Invoice Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Client Information Card */}
                    <div className="bg-dark-850/50 border border-dark-600/30 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <User className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary uppercase tracking-wider text-sm">Client Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Client Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-dark-900/50 border border-dark-600/50 rounded-xl px-4 py-3 text-text-primary focus:border-primary/50 outline-none transition-all"
                                    value={clientInfo.name}
                                    onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Client Email</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full bg-dark-900/50 border border-dark-600/50 rounded-xl px-4 py-3 text-text-primary focus:border-primary/50 outline-none transition-all"
                                    value={clientInfo.email}
                                    onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Billing Address</label>
                                <textarea
                                    placeholder="123 Business Way, Suite 100, City, Country"
                                    rows="3"
                                    className="w-full bg-dark-900/50 border border-dark-600/50 rounded-xl px-4 py-3 text-text-primary focus:border-primary/50 outline-none transition-all resize-none"
                                    value={clientInfo.address}
                                    onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Invoice Items Card */}
                    <div className="bg-dark-850/50 border border-dark-600/30 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-text-primary uppercase tracking-wider text-sm">Invoice Items</h3>
                            </div>
                            <button
                                onClick={addItem}
                                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Item</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-dark-900/40 rounded-lg text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                                <div className="col-span-6">Description</div>
                                <div className="col-span-2">Qty</div>
                                <div className="col-span-3">Price</div>
                                <div className="col-span-1 text-right">Action</div>
                            </div>

                            {/* Items List */}
                            {items.map((item) => (
                                <div key={item.id} className="grid grid-cols-12 gap-4 items-center animate-standard">
                                    <div className="col-span-6">
                                        <input
                                            type="text"
                                            placeholder="Service or Product name"
                                            className="w-full bg-dark-900/30 border border-dark-600/30 rounded-lg px-3 py-2 text-sm text-text-primary focus:border-primary/50 outline-none transition-all"
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            className="w-full bg-dark-900/30 border border-dark-600/30 rounded-lg px-3 py-2 text-sm text-text-primary focus:border-primary/50 outline-none transition-all"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">₹</span>
                                            <input
                                                type="number"
                                                className="w-full bg-dark-900/30 border border-dark-600/30 rounded-lg pl-7 pr-3 py-2 text-sm text-text-primary focus:border-primary/50 outline-none transition-all"
                                                value={item.price}
                                                onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Summaries & Settings */}
                <div className="space-y-6">
                    {/* Invoice Meta Card */}
                    <div className="bg-dark-850/50 border border-dark-600/30 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary uppercase tracking-wider text-sm">Invoice Details</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Invoice Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-dark-900/50 border border-dark-600/50 rounded-xl px-4 py-3 text-text-primary focus:border-primary/50 outline-none transition-all"
                                    value={clientInfo.invoiceDate}
                                    onChange={(e) => setClientInfo({ ...clientInfo, invoiceDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Due Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-dark-900/50 border border-dark-600/50 rounded-xl px-4 py-3 text-text-primary focus:border-primary/50 outline-none transition-all"
                                    value={clientInfo.dueDate}
                                    onChange={(e) => setClientInfo({ ...clientInfo, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-gradient-to-br from-dark-850 to-dark-900 border border-primary/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <CreditCard className="w-24 h-24 text-primary" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-text-primary uppercase tracking-wider text-sm mb-6">Total Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-text-muted">Subtotal</span>
                                    <span className="text-text-primary font-bold">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-text-muted">GST (18%)</span>
                                    <span className="text-text-primary font-bold">₹{taxAmount.toLocaleString()}</span>
                                </div>
                                <div className="pt-4 border-t border-dark-600/50 flex justify-between items-center">
                                    <span className="text-text-primary font-black uppercase tracking-widest text-xs">Total Amount</span>
                                    <span className="text-2xl font-black text-primary">₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillGenerate;
