/**
 * Finance Tracker Pro - Core Application Engine
 * Architecture: Object-Oriented State Controller with LocalStorage Synchronization
 */

class FinanceTrackerApp {
    constructor() {
        // --- State Definitions ---
        this.transactions = [];
        this.monthlyBudget = 0.00;
        this.currentTheme = 'light';
        this.editingTransactionId = null;
        this.deletingTransactionId = null;

        // --- Chart Instance Handlers ---
        this.lineChart = null;
        this.pieChart = null;
        this.barChart = null;

        // --- Initialize Application Components ---
        this.initElements();
        this.loadStateFromStorage();
        this.initEventListeners();
        this.renderApplicationLayers();
    }

    /**
     * Cache DOM Element Nodes to prevent runtime query lookup costs
     */
    initElements() {
        // Navigation & Theme Elements
        this.themeToggleBtn = document.getElementById('themeToggleBtn');
        this.navBudgetAmount = document.getElementById('navBudgetAmount');

        // Metrics Card View Layer Components
        this.totalBalanceEl = document.getElementById('totalBalance');
        this.totalIncomeEl = document.getElementById('totalIncome');
        this.totalExpenseEl = document.getElementById('totalExpense');
        this.totalSavingsEl = document.getElementById('totalSavings');
        this.savingsProgress = document.getElementById('savingsProgress');
        this.savingsRateLabel = document.getElementById('savingsRateLabel');
        this.budgetRemainingEl = document.getElementById('budgetRemaining');
        this.budgetProgress = document.getElementById('budgetProgress');
        this.budgitUsageLabel = document.getElementById('budgitUsageLabel');
        this.todaySpendingEl = document.getElementById('todaySpending');

        // Budget Planning Architecture Elements
        this.budgetForm = document.getElementById('budgetForm');
        this.monthlyBudgetInput = document.getElementById('monthlyBudgetInput');
        this.budgetInputError = document.getElementById('budgetInputError');
        this.budgetAlertBox = document.getElementById('budgetAlertBox');
        this.budgetAlertMessage = document.getElementById('budgetAlertMessage');

        // Data Management Portability Elements
        this.exportCsvBtn = document.getElementById('exportCsvBtn');
        this.importCsvFile = document.getElementById('importCsvFile');

        // Transaction Console Form Elements
        this.transactionForm = document.getElementById('transactionForm');
        this.formPanelTitle = document.getElementById('formPanelTitle');
        this.txCategory = document.getElementById('txCategory');
        this.txAmount = document.getElementById('txAmount');
        this.txDate = document.getElementById('txDate');
        this.txDescription = document.getElementById('txDescription');
        this.submitFormBtn = document.getElementById('submitFormBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');

        // Form Validation UI Matrix Identifiers
        this.txCategoryError = document.getElementById('txCategoryError');
        this.txAmountError = document.getElementById('txAmountError');
        this.txDateError = document.getElementById('txDateError');
        this.txDescriptionError = document.getElementById('txDescriptionError');

        // Audit Filter Toolbar Elements
        this.ledgerCountBadge = document.getElementById('ledgerCountBadge');
        this.searchFilterInput = document.getElementById('searchFilterInput');
        this.categoryFilterDropdown = document.getElementById('categoryFilterDropdown');
        this.typeFilterDropdown = document.getElementById('typeFilterDropdown');
        this.sortConfigDropdown = document.getElementById('sortConfigDropdown');
        this.amountMinInput = document.getElementById('amountMinInput');
        this.amountMaxInput = document.getElementById('amountMaxInput');
        this.dateStartInput = document.getElementById('dateStartInput');
        this.dateEndInput = document.getElementById('dateEndInput');
        this.resetFiltersBtn = document.getElementById('resetFiltersBtn');

        // Ledger Core Table Nodes
        this.ledgerTableBody = document.getElementById('ledgerTableBody');
        this.emptyStatePlaceholder = document.getElementById('emptyStatePlaceholder');

        // Global Confirmation Dialog Overlay Elements
        this.confirmationModal = document.getElementById('confirmationModal');
        this.modalCancelBtn = document.getElementById('modalCancelBtn');
        this.modalConfirmBtn = document.getElementById('modalConfirmBtn');
    }

    /**
     * Hydrate application state variables out of local persistence layer
     */
    loadStateFromStorage() {
        try {
            const rawTransactions = localStorage.getItem('ftp_transactions');
            this.transactions = rawTransactions ? JSON.parse(rawTransactions) : [];
            
            const savedBudget = localStorage.getItem('ftp_monthly_budget');
            this.monthlyBudget = savedBudget ? parseFloat(savedBudget) : 0.00;
            this.monthlyBudgetInput.value = this.monthlyBudget > 0 ? this.monthlyBudget.toFixed(2) : '';

            const savedTheme = localStorage.getItem('ftp_theme');
            this.currentTheme = savedTheme ? savedTheme : 'light';
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            this.updateThemeToggleButtonUI();
        } catch (error) {
            console.error('Storage Engine Failure: State reconstruction aborted.', error);
            this.transactions = [];
            this.monthlyBudget = 0.00;
        }
    }

    /**
     * Persist localized analytical records schema structures safely
     */
    saveStateToStorage() {
        try {
            localStorage.setItem('ftp_transactions', JSON.stringify(this.transactions));
            localStorage.setItem('ftp_monthly_budget', this.monthlyBudget.toString());
            localStorage.setItem('ftp_theme', this.currentTheme);
        } catch (error) {
            console.error('Storage Write Exception: Failed to serialize ledger properties.', error);
        }
    }

    /**
     * Set up comprehensive asynchronous operational framework events
     */
    initEventListeners() {
        // Theme Toggle
        this.themeToggleBtn.addEventListener('click', () => this.handleThemeToggle());

        // Budget Adjustments Forms
        this.budgetForm.addEventListener('submit', (e) => this.handleBudgetSubmission(e));

        // Data Logistics Integration Points
        this.exportCsvBtn.addEventListener('click', () => this.exportLedgerToCsvDocument());
        this.importCsvFile.addEventListener('change', (e) => this.handleCsvImportExecution(e));

        // Transaction Management Inputs Form Handling
        this.transactionForm.addEventListener('submit', (e) => this.handleTransactionFormSubmit(e));
        this.cancelEditBtn.addEventListener('click', () => this.resetTransactionFormState());

        // Filter Stream Configuration Iterations
        const realTimeFilterNodes = [
            this.searchFilterInput, this.categoryFilterDropdown, this.typeFilterDropdown,
            this.sortConfigDropdown, this.amountMinInput, this.amountMaxInput,
            this.dateStartInput, this.dateEndInput
        ];
        realTimeFilterNodes.forEach(element => {
            element.addEventListener('input', () => this.renderLedgerAndChartsLayer());
            element.addEventListener('change', () => this.renderLedgerAndChartsLayer());
        });

        this.resetFiltersBtn.addEventListener('click', () => this.resetActiveFiltersToolbar());

        // Modal Interactive Bindings Layer
        this.modalCancelBtn.addEventListener('click', () => this.closeConfirmationModal());
        this.modalConfirmBtn.addEventListener('click', () => this.executeConfirmedDeletion());
        
        // Background overlay click event clears dialog structures safely
        this.confirmationModal.addEventListener('click', (e) => {
            if (e.target === this.confirmationModal) this.closeConfirmationModal();
        });
    }

    /* ==========================================================================
       THEMATIC CONTROL SUITE
       ========================================================================== */
    handleThemeToggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.saveStateToStorage();
        this.updateThemeToggleButtonUI();
        this.renderChartsLayer(); // Force refresh to render grid fonts gracefully
    }

    updateThemeToggleButtonUI() {
        const icon = this.themeToggleBtn.querySelector('i');
        if (this.currentTheme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    /* ==========================================================================
       BUDGET REGISTRATION SYSTEM
       ========================================================================== */
    handleBudgetSubmission(e) {
        e.preventDefault();
        const value = parseFloat(this.monthlyBudgetInput.value);

        if (isNaN(value) || value < 0) {
            this.monthlyBudgetInput.classList.add('input-error');
            this.budgetInputError.style.display = 'block';
            return;
        }

        this.monthlyBudgetInput.classList.remove('input-error');
        this.budgetInputError.style.display = 'none';
        
        this.monthlyBudget = value;
        this.saveStateToStorage();
        this.renderApplicationLayers();
    }

    /* ==========================================================================
       TRANSACTION INTERACTIVE OPERATION COMPILING ENGINE
       ========================================================================== */
    handleTransactionFormSubmit(e) {
        e.preventDefault();
        if (!this.validateTransactionFormInputs()) return;

        const classification = document.querySelector('input[name="txType"]:checked').value;
        const category = this.txCategory.value;
        const amount = parseFloat(this.txAmount.value);
        const date = this.txDate.value;
        const description = this.txDescription.value.trim();

        if (this.editingTransactionId !== null) {
            // Processing Modification Pipeline
            const idx = this.transactions.findIndex(t => t.id === this.editingTransactionId);
            if (idx !== -1) {
                this.transactions[idx] = {
                    id: this.editingTransactionId,
                    classification,
                    category,
                    amount,
                    date,
                    description
                };
            }
        } else {
            // Generating New Record Entity Node
            const newRecord = {
                id: 'tx_node_' + Date.now() + Math.random().toString(36).substr(2, 5),
                classification,
                category,
                amount,
                date,
                description
            };
            this.transactions.push(newRecord);
        }

        this.saveStateToStorage();
        this.resetTransactionFormState();
        this.renderApplicationLayers();
    }

    validateTransactionFormInputs() {
        let isValid = true;

        // Category Asset Domain Validation
        if (!this.txCategory.value) {
            this.txCategory.classList.add('input-error');
            this.txCategoryError.style.display = 'block';
            isValid = false;
        } else {
            this.txCategory.classList.remove('input-error');
            this.txCategoryError.style.display = 'none';
        }

        // Amount Quantification Boundary Check
        const amt = parseFloat(this.txAmount.value);
        if (isNaN(amt) || amt <= 0) {
            this.txAmount.classList.add('input-error');
            this.txAmountError.style.display = 'block';
            isValid = false;
        } else {
            this.txAmount.classList.remove('input-error');
            this.txAmountError.style.display = 'none';
        }

        // Operational Timestamp Data Baseline Verification
        if (!this.txDate.value) {
            this.txDate.classList.add('input-error');
            this.txDateError.style.display = 'block';
            isValid = false;
        } else {
            this.txDate.classList.remove('input-error');
            this.txDateError.style.display = 'none';
        }

        // Character Meta Field Mapping Integrity Test
        if (!this.txDescription.value.trim()) {
            this.txDescription.classList.add('input-error');
            this.txDescriptionError.style.display = 'block';
            isValid = false;
        } else {
            this.txDescription.classList.remove('input-error');
            this.txDescriptionError.style.display = 'none';
        }

        return isValid;
    }

    initiateEditPipeline(id) {
        const target = this.transactions.find(t => t.id === id);
        if (!target) return;

        this.editingTransactionId = id;
        this.formPanelTitle.innerHTML = `<i class="fa-solid fa-pen-to-square icon-margin"></i>Modify Ledger Node`;
        this.submitFormBtn.innerHTML = `<i class="fa-solid fa-square-check icon-margin"></i>Save Modified Parameters`;
        this.cancelEditBtn.classList.remove('hidden');

        // Form fields population
        document.querySelector(`input[name="txType"][value="${target.classification}"]`).checked = true;
        this.txCategory.value = target.category;
        this.txAmount.value = target.amount;
        this.txDate.value = target.date;
        this.txDescription.value = target.description;

        // Smooth viewport scrolling navigation feedback alignment response action
        this.transactionForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    resetTransactionFormState() {
        this.editingTransactionId = null;
        this.formPanelTitle.innerHTML = `<i class="fa-solid fa-circle-plus icon-margin"></i>Add Transaction`;
        this.submitFormBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up icon-margin"></i>Commit Transaction Asset`;
        this.cancelEditBtn.classList.add('hidden');
        
        this.transactionForm.reset();
        
        // Flush active validator warnings
        const errors = [this.txCategoryError, this.txAmountError, this.txDateError, this.txDescriptionError];
        const inputs = [this.txCategory, this.txAmount, this.txDate, this.txDescription];
        errors.forEach(e => e.style.display = 'none');
        inputs.forEach(i => i.classList.remove('input-error'));
    }

    initiateDeletePipeline(id) {
        this.deletingTransactionId = id;
        this.confirmationModal.classList.remove('hidden');
    }

    closeConfirmationModal() {
        this.deletingTransactionId = null;
        this.confirmationModal.classList.add('hidden');
    }

    executeConfirmedDeletion() {
        if (this.deletingTransactionId === null) return;
        
        this.transactions = this.transactions.filter(t => t.id !== this.deletingTransactionId);
        
        // If current element node undergoes purge during revision loop context, clear active forms safely
        if (this.editingTransactionId === this.deletingTransactionId) {
            this.resetTransactionFormState();
        }

        this.saveStateToStorage();
        this.closeConfirmationModal();
        this.renderApplicationLayers();
    }

    /* ==========================================================================
       DASHBOARD CALCULATION SYSTEM MAPPING METRICS LAYER
       ========================================================================== */
    calculateMetricSummaryLayer() {
        let income = 0;
        let expense = 0;
        let todaySpending = 0;

        const currentTimestampStr = new Date().toISOString().split('T')[0];

        this.transactions.forEach(t => {
            const val = t.amount;
            if (t.classification === 'income') {
                income += val;
            } else if (t.classification === 'expense') {
                expense += val;
                if (t.date === currentTimestampStr) {
                    todaySpending += val;
                }
            }
        });

        const netBalance = income - expense;
        const netSavings = Math.max(0, netBalance);
        const savingsRate = income > 0 ? Math.round((netSavings / income) * 100) : 0;
        const budgetRemaining = this.monthlyBudget - expense;
        const budgetUsagePercentage = this.monthlyBudget > 0 ? Math.round((expense / this.monthlyBudget) * 100) : 0;

        return {
            netBalance, income, expense, netSavings, savingsRate,
            budgetRemaining, budgetUsagePercentage, todaySpending
        };
    }

    renderMetricSummaryDisplayLayer(metrics) {
        // Render Text Values
        this.totalBalanceEl.innerText = this.formatCurrencyRepresentation(metrics.netBalance);
        this.totalIncomeEl.innerText = this.formatCurrencyRepresentation(metrics.income);
        this.totalExpenseEl.innerText = this.formatCurrencyRepresentation(metrics.expense);
        this.totalSavingsEl.innerText = this.formatCurrencyRepresentation(metrics.netSavings);
        this.todaySpendingEl.innerText = this.formatCurrencyRepresentation(metrics.todaySpending);
        this.navBudgetAmount.innerText = this.formatCurrencyRepresentation(this.monthlyBudget);

        // Update Balance Card Text Color Clues dynamically
        if (metrics.netBalance < 0) {
            this.totalBalanceEl.className = "metric-value text-danger";
        } else {
            this.totalBalanceEl.className = "metric-value";
        }

        // Savings Progress Calculation
        this.savingsProgress.style.width = `${Math.min(100, metrics.savingsRate)}%`;
        this.savingsRateLabel.innerText = `Savings Rate: ${metrics.savingsRate}%`;

        // Budget Execution Tracking Display Elements Layer Configuration
        this.budgetRemainingEl.innerText = this.formatCurrencyRepresentation(metrics.budgetRemaining);
        this.budgetProgress.style.width = `${Math.min(100, metrics.budgetUsagePercentage)}%`;
        this.budgitUsageLabel.innerText = `${metrics.budgetUsagePercentage}% of target spent`;

        if (metrics.budgetRemaining < 0) {
            this.budgetRemainingEl.className = "metric-value text-danger";
            this.budgetProgress.classList.add('danger-progress');
        } else {
            this.budgetRemainingEl.className = "metric-value";
            this.budgetProgress.classList.remove('danger-progress');
        }

        // Threshold Alert Banner Messaging System Pipeline Execution Layer Trigger
        if (this.monthlyBudget > 0 && metrics.budgetUsagePercentage >= 85) {
            this.budgetAlertBox.classList.remove('hidden');
            if (metrics.budgetUsagePercentage >= 100) {
                this.budgetAlertMessage.innerText = `Critical Alert: Capital outlays exceeded configured monthly limit boundaries by ${this.formatCurrencyRepresentation(Math.abs(metrics.budgetRemaining))}!`;
            } else {
                this.budgetAlertMessage.innerText = `Attention Threshold: Ledger records register high burn risk. Only ${metrics.budgetUsagePercentage}% allowance remain buffer.`;
            }
        } else {
            this.budgetAlertBox.classList.add('hidden');
        }
    }

    /* ==========================================================================
       LEDGER REGISTRY FILTERS DISPATCH PIPELINE DESIGN
       ========================================================================== */
    fetchFilteredAndSortedDataset() {
        // Pull constraints parameters natively out of active document state nodes
        const queryTerm = this.searchFilterInput.value.toLowerCase().trim();
        const catFilter = this.categoryFilterDropdown.value;
        const typeFilter = this.typeFilterDropdown.value;
        const sortCriteria = this.sortConfigDropdown.value;
        const minAmt = parseFloat(this.amountMinInput.value);
        const maxAmt = parseFloat(this.amountMaxInput.value);
        const dateStart = this.dateStartInput.value;
        const dateEnd = this.dateEndInput.value;

        return this.transactions.filter(t => {
            // Text Search Filter Matrix Target Validation Mapping Functionality
            if (queryTerm && !t.description.toLowerCase().includes(queryTerm) && !t.category.toLowerCase().includes(queryTerm)) {
                return false;
            }
            // Category Filter
            if (catFilter !== 'ALL' && t.category !== catFilter) return false;
            // Class Type Flow Matrix Filter
            if (typeFilter !== 'ALL' && t.classification !== typeFilter) return false;
            // Minimum Numeric Ceiling Range Checks
            if (!isNaN(minAmt) && t.amount < minAmt) return false;
            // Maximum Boundaries Cap Tests
            if (!isNaN(maxAmt) && t.amount > maxAmt) return false;
            // Analytical Historical Timestamps Left Boundaries Check
            if (dateStart && t.date < dateStart) return false;
            // Analytical Historical Timestamps Right Boundaries Check
            if (dateEnd && t.date > dateEnd) return false;

            return true;
        }).sort((alpha, beta) => {
            // Processing Dynamic Data Grid Sorting Paradigm Actions Stack Configurations Layer
            switch (sortCriteria) {
                case 'date_desc':
                    return new Date(beta.date) - new Date(alpha.date);
                case 'date_asc':
                    return new Date(alpha.date) - new Date(beta.date);
                case 'amount_desc':
                    return beta.amount - alpha.amount;
                case 'amount_asc':
                    return alpha.amount - beta.amount;
                default:
                    return 0;
            }
        });
    }

    renderLedgerTableDisplayRows(dataset) {
        this.ledgerTableBody.innerHTML = '';
        this.ledgerCountBadge.innerText = `${dataset.length} Record${dataset.length === 1 ? '' : 's'}`;

        if (dataset.length === 0) {
            this.emptyStatePlaceholder.classList.remove('hidden');
            return;
        }
        this.emptyStatePlaceholder.classList.add('hidden');

        dataset.forEach(t => {
            const tableRow = document.createElement('tr');
            
            // Classification Badge UI Rendering parameters
            const flowsIcon = t.classification === 'income' 
                ? '<span class="flow-badge bg-success-soft text-success"><i class="fa-solid fa-arrow-up-long"></i></span>'
                : '<span class="flow-badge bg-danger-soft text-danger"><i class="fa-solid fa-arrow-down-long"></i></span>';

            const formattedValue = t.classification === 'income'
                ? `+${this.formatCurrencyRepresentation(t.amount)}`
                : `-${this.formatCurrencyRepresentation(t.amount)}`;
                
            const valueThemeClass = t.classification === 'income' ? 'text-success' : 'text-danger';

            tableRow.innerHTML = `
                <td>${flowsIcon}</td>
                <td style="font-weight: 500;">${this.formatDateLayoutString(t.date)}</td>
                <td><span class="category-tag">${t.category}</span></td>
                <td><div class="desc-text" title="${this.sanitizeHtmlMarkupString(t.description)}">${this.sanitizeHtmlMarkupString(t.description)}</div></td>
                <td class="amount-cell ${valueThemeClass}" style="text-align: right;">${formattedValue}</td>
                <td>
                    <div class="row-controls-wrapper">
                        <button class="btn-icon-control edit" data-id="${t.id}" title="Modify Data Entry Parameters"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn-icon-control delete" data-id="${t.id}" title="Purge Record Instance Node"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            `;

            // Operational row interactive control target registration layer mapping
            tableRow.querySelector('.edit').addEventListener('click', () => this.initiateEditPipeline(t.id));
            tableRow.querySelector('.delete').addEventListener('click', () => this.initiateDeletePipeline(t.id));

            this.ledgerTableBody.appendChild(tableRow);
        });
    }

    resetActiveFiltersToolbar() {
        this.searchFilterInput.value = '';
        this.categoryFilterDropdown.value = 'ALL';
        this.typeFilterDropdown.value = 'ALL';
        this.sortConfigDropdown.value = 'date_desc';
        this.amountMinInput.value = '';
        this.amountMaxInput.value = '';
        this.dateStartInput.value = '';
        this.dateEndInput.value = '';

        this.renderLedgerAndChartsLayer();
    }

    /* ==========================================================================
       CHART.JS VISUAL DATA INTERFACE ARCHITECTURE MANAGEMENT LAYER
       ========================================================================== */
    renderChartsLayer() {
        const activeThemeIsDark = this.currentTheme === 'dark';
        const scaleGridColor = activeThemeIsDark ? '#334155' : '#e2e8f0';
        const axisTicksColor = activeThemeIsDark ? '#94a3b8' : '#64748b';

        // --- Data Compiling Logic Modules for Charts ---
        const allocationMatrixMap = {};
        let grossInflowsTotal = 0;
        let grossOutflowsTotal = 0;

        // Dynamic Chronological Aggregates Layer Mapping Canvas Setup
        const aggregateTrendsMap = {};

        this.transactions.forEach(t => {
            const val = t.amount;
            const dateStr = t.date;

            if (!aggregateTrendsMap[dateStr]) {
                aggregateTrendsMap[dateStr] = { income: 0, expense: 0 };
            }

            if (t.classification === 'income') {
                grossInflowsTotal += val;
                aggregateTrendsMap[dateStr].income += val;
            } else {
                grossOutflowsTotal += val;
                aggregateTrendsMap[dateStr].expense += val;
                allocationMatrixMap[t.category] = (allocationMatrixMap[t.category] || 0) + val;
            }
        });

        // Generate Time Series for Line Chart
        const orderedChronologicalKeys = Object.keys(aggregateTrendsMap).sort((a, b) => new Date(a) - new Date(b));
        const lineChartLabels = [];
        const runningBalanceCurvePoints = [];
        let runningAccumulatorSum = 0;

        orderedChronologicalKeys.forEach(dateKey => {
            lineChartLabels.push(this.formatDateLayoutString(dateKey));
            const deltaNode = aggregateTrendsMap[dateKey].income - aggregateTrendsMap[dateKey].expense;
            runningAccumulatorSum += deltaNode;
            runningBalanceCurvePoints.push(runningAccumulatorSum);
        });

        // 1. Line Chart Lifecycle Management Loop
        if (this.lineChart) this.lineChart.destroy();
        const ctxLine = document.getElementById('lineChartCanvas').getContext('2d');
        this.lineChart = new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: lineChartLabels,
                datasets: [{
                    label: 'Net Available Growth Curve',
                    data: runningBalanceCurvePoints,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointRadius: lineChartLabels.length > 20 ? 0 : 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    x: {
                        grid: { color: 'transparent' },
                        ticks: { color: axisTicksColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
                    },
                    y: {
                        grid: { color: scaleGridColor },
                        ticks: { color: axisTicksColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
                    }
                }
            }
        });

        // 2. Pie Chart (Expense Allocation Breakdown)
        const pieLabels = Object.keys(allocationMatrixMap);
        const pieDataValues = Object.values(allocationMatrixMap);
        
        if (this.pieChart) this.pieChart.destroy();
        const ctxPie = document.getElementById('pieChartCanvas').getContext('2d');
        this.pieChart = new Chart(ctxPie, {
            type: 'doughnut',
            data: {
                labels: pieLabels,
                datasets: [{
                    data: pieDataValues,
                    backgroundColor: [
                        '#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', 
                        '#06b6d4', '#ec4899', '#f43f5e', '#14b8a6', '#64748b'
                    ],
                    borderWidth: activeThemeIsDark ? 2 : 1,
                    borderColor: activeThemeIsDark ? '#1e293b' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: activeThemeIsDark ? '#f8fafc' : '#1e293b',
                            font: { family: 'Plus Jakarta Sans', size: 11, weight: 500 },
                            boxWidth: 12
                        }
                    }
                }
            }
        });

        // 3. Bar Chart (Inflow vs Outflow Contrast Volume)
        if (this.barChart) this.barChart.destroy();
        const ctxBar = document.getElementById('barChartCanvas').getContext('2d');
        this.barChart = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Total Inflows', 'Total Outflows'],
                datasets: [{
                    data: [grossInflowsTotal, grossOutflowsTotal],
                    backgroundColor: ['rgba(16, 185, 129, 0.85)', 'rgba(239, 68, 68, 0.85)'],
                    borderRadius: 8,
                    barThickness: 32
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: axisTicksColor, font: { family: 'Plus Jakarta Sans' } } },
                    y: { grid: { color: scaleGridColor }, ticks: { color: axisTicksColor, font: { family: 'Plus Jakarta Sans' } } }
                }
            }
        });
    }

    /* ==========================================================================
       DATA LOGISTICS PIPELINE CONSOLE (CSV SYSTEM MANAGEMENT ENGINE)
       ========================================================================== */
    exportLedgerToCsvDocument() {
        if (this.transactions.length === 0) {
            alert("Export operational state failure: Core asset data grid is vacant.");
            return;
        }

        const standardCsvHeaders = ['Transaction ID', 'Classification Flow Type', 'Categorical Allocation Domain', 'Value Amount ($)', 'Execution Date YYYY-MM-DD', 'Description Metadata Rationale'];
        
        const rawBodyTextRowStrings = this.transactions.map(t => {
            return [
                t.id,
                t.classification,
                t.category,
                t.amount.toFixed(2),
                t.date,
                `"${t.description.replace(/"/g, '""')}"` // Sanitize inline quotes to prevent breaking standard compliance
            ].join(',');
        });

        const completeCsvBufferString = [standardCsvHeaders.join(','), ...rawBodyTextRowStrings].join('\n');
        
        // Blob Delivery Pipeline Integration Layout Mapping Target Sequence Actions Stack
        const textBlobInstance = new Blob([completeCsvBufferString], { type: 'text/csv;charset=utf-8;' });
        const logicalAnchorNodeElement = document.createElement('a');
        const processingUrlBufferNode = URL.createObjectURL(textBlobInstance);
        
        logicalAnchorNodeElement.setAttribute('href', processingUrlBufferNode);
        logicalAnchorNodeElement.setAttribute('download', `Finance_Tracker_Ledger_Export_${new Date().toISOString().split('T')[0]}.csv`);
        logicalAnchorNodeElement.style.visibility = 'hidden';
        
        document.body.appendChild(logicalAnchorNodeElement);
        logicalAnchorNodeElement.click();
        document.body.removeChild(logicalAnchorNodeElement);
    }

    handleCsvImportExecution(e) {
        const targetDocument = e.target.files[0];
        if (!targetDocument) return;

        const dynamicBufferStreamReader = new FileReader();
        dynamicBufferStreamReader.onload = (event) => {
            const rawContentText = event.target.result;
            this.parseAndIngestCsvBufferStream(rawContentText);
        };
        dynamicBufferStreamReader.readAsText(targetDocument);
        
        // Reset element target value pointer index so identical file choices register again flawlessly
        this.importCsvFile.value = '';
    }

    parseAndIngestCsvBufferStream(text) {
        const documentRowSplitArrays = text.split(/\r?\n/);
        if (documentRowSplitArrays.length <= 1) {
            alert("Parsing Exception: Input schema contains empty structures.");
            return;
        }

        const parsedAssetNodeCollector = [];
        let parsingFailureEncounteredCounter = 0;

        // Skip headers line segment initialization block parameters index pointer 1 array grid layout
        for (let idx = 1; idx < documentRowSplitArrays.length; idx++) {
            const currentLineTextString = documentRowSplitArrays[idx].trim();
            if (!currentLineTextString) continue; // Ignore blank structural break rows padding elements cleanly

            // Advanced regex line segment mapping array splitting mechanism ensuring quotes parsing safety rules enforcement metrics mapping layout
            const matchedRowColumns = currentLineTextString.match(/(".*?"|[^,\s]+)(?=\s*,|\s*$)/g) 
                || currentLineTextString.split(',');

            if (matchedRowColumns.length < 6) {
                parsingFailureEncounteredCounter++;
                continue;
            }

            const classification = matchedRowColumns[1].trim().toLowerCase();
            const category = matchedRowColumns[2].trim();
            const amount = parseFloat(matchedRowColumns[3].trim());
            const date = matchedRowColumns[4].trim();
            let description = matchedRowColumns[5].trim();

            // Extract bounding string parsing quote wrapper properties safely
            if (description.startsWith('"') && description.endsWith('"')) {
                description = description.slice(1, -1).replace(/""/g, '"');
            }

            // Line segment structure parsing evaluation tests matching production requirements boundaries schema structures rules execution
            const classificationIsValid = (classification === 'income' || classification === 'expense');
            const numericValueIsValid = (!isNaN(amount) && amount > 0);
            const dateValidationMatches = /^\d{4}-\d{2}-\d{2}$/.test(date);

            if (classificationIsValid && numericValueIsValid && dateValidationMatches && category && description) {
                parsedAssetNodeCollector.push({
                    id: 'tx_node_' + Date.now() + Math.random().toString(36).substr(2, 5) + '_' + idx,
                    classification,
                    category,
                    amount,
                    date,
                    description
                });
            } else {
                parsingFailureEncounteredCounter++;
            }
        }

        if (parsedAssetNodeCollector.length > 0) {
            // Append safely inside active dataset rows
            this.transactions = [...this.transactions, ...parsedAssetNodeCollector];
            this.saveStateToStorage();
            this.renderApplicationLayers();
            
            if (parsingFailureEncounteredCounter > 0) {
                alert(`Data parsing compilation finished with caveats: Processed and successfully imported ${parsedAssetNodeCollector.length} node rows. However, ${parsingFailureEncounteredCounter} records were dropped due to malformed schema properties structural anomalies layout errors.`);
            } else {
                alert(`Success: Verified, integrated, and serialized ${parsedAssetNodeCollector.length} records safely.`);
            }
        } else {
            alert("Import Aborted: Failed to find any standard-compliant ledger rows inside input document framework architecture elements.");
        }
    }

    /* ==========================================================================
       RENDER COORDINATION CORE PIPELINE
       ========================================================================== */
    renderApplicationLayers() {
        const metrics = this.calculateMetricSummaryLayer();
        this.renderMetricSummaryDisplayLayer(metrics);
        this.renderLedgerAndChartsLayer();
    }

    renderLedgerAndChartsLayer() {
        const subsetDataset = this.fetchFilteredAndSortedDataset();
        this.renderLedgerTableDisplayRows(subsetDataset);
        this.renderChartsLayer();
    }

    /* ==========================================================================
       UTILITY FORMATTING & SECURITY SANITIZATION HELPERS
       ========================================================================== */
    formatCurrencyRepresentation(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    formatDateLayoutString(rawDateString) {
        if (!rawDateString) return '';
        const dataArrayComponents = rawDateString.split('-');
        if (dataArrayComponents.length !== 3) return rawDateString;
        
        // Formats to localization layout pattern matching US financial presentation benchmarks layers
        const temporalDateObjectInstance = new Date(dataArrayComponents[0], dataArrayComponents[1] - 1, dataArrayComponents[2]);
        return temporalDateObjectInstance.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    sanitizeHtmlMarkupString(inputString) {
        const secureMappingDivElementNode = document.createElement('div');
        secureMappingDivElementNode.innerText = inputString;
        return secureMappingDivElementNode.innerHTML;
    }
}

// Global Application Engine Liftoff Trigger deployment initialization execution context
document.addEventListener('DOMContentLoaded', () => {
    window.FinanceTrackerProInstance = new FinanceTrackerApp();
});
