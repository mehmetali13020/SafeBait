// Hardcoded Dashboard Verileri
const dashboardData = {
    targets: [
        { id: 1, name: "Ahmet Yılmaz", department: "İnsan Kaynakları", date: "2023-11-20 09:15", device: "Chrome / Windows", status: "clicked" },
        { id: 2, name: "Ayşe Kaya", department: "Muhasebe", date: "2023-11-20 09:12", device: "Safari / macOS", status: "safe" },
        { id: 3, name: "Mehmet Demir", department: "Satış", date: "2023-11-20 09:30", device: "Edge / Windows", status: "clicked" },
        { id: 4, name: "Zeynep Çelik", department: "Pazarlama", date: "2023-11-20 10:05", device: "Chrome / Android", status: "clicked" },
        { id: 5, name: "Ali Veli", department: "İnsan Kaynakları", date: "2023-11-20 10:15", device: "Firefox / Linux", status: "sent" },
        { id: 6, name: "Fatma Şahin", department: "IT", date: "2023-11-20 09:05", device: "Chrome / Windows", status: "safe" },
        { id: 7, name: "Caner Aydın", department: "Pazarlama", date: "2023-11-20 11:20", device: "Safari / iOS", status: "clicked" },
        { id: 8, name: "Elif Öz", department: "Satış", date: "2023-11-20 11:45", device: "Chrome / Windows", status: "safe" }
    ],
    stats: {
        totalTargets: 154,
        clickedCount: 68,
        eduCompleted: 35, // percent
        timelineData: {
            labels: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
            clicks: [5, 15, 25, 40, 50, 62, 68]
        },
        deptVulnerability: {
            labels: ["Satış", "Pazarlama", "İnsan Kaynakları", "Muhasebe", "IT"],
            data: [45, 60, 30, 15, 5] // percentage of failures
        },
        deviceData: {
            labels: ["Windows", "macOS", "iOS", "Android"],
            data: [55, 20, 15, 10]
        }
    }
};

// Ortak Chart.js ayarları (Koyu tema uyumu için)
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', sans-serif";

// Dashboard Başlatıcı
document.addEventListener('DOMContentLoaded', () => {
    initSummaryStats();
    initPieChart();
    initBarChart();
    initTimelineChart();
    initDeviceChart();
    initTable();
});

// 1. Özet İstatistikleri Doldur
function initSummaryStats() {
    const stats = dashboardData.stats;
    const clickRate = Math.round((stats.clickedCount / stats.totalTargets) * 100);

    document.getElementById('statTotalTargets').innerText = stats.totalTargets;
    document.getElementById('statClickRate').innerText = `%${clickRate}`;
    document.getElementById('statEduCompleted').innerText = `%${stats.eduCompleted}`;

    // En zayıf departmanı bul
    const maxVulnIndex = stats.deptVulnerability.data.indexOf(Math.max(...stats.deptVulnerability.data));
    document.getElementById('statWeakestDept').innerText = stats.deptVulnerability.labels[maxVulnIndex];
}

// 2. Pasta Grafik (Tıklama Oranı - Zafiyet)
function initPieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    const stats = dashboardData.stats;
    const safeCount = stats.totalTargets - stats.clickedCount;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Oltalama Linkine Tıklayanlar', 'Güvende Olanlar'],
            datasets: [{
                data: [stats.clickedCount, safeCount],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)', // Kırmızı
                    'rgba(16, 185, 129, 0.8)' // Yeşil
                ],
                borderColor: [
                    '#ef4444',
                    '#10b981'
                ],
                borderWidth: 1,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)' }
            },
            cutout: '70%'
        }
    });
}

// 3. Çubuk Grafik (Departmana Göre Zafiyet)
function initBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    const stats = dashboardData.stats;

    // Gradyan oluşturma
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.8)'); // Cyan
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.8)'); // Blue

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stats.deptVulnerability.labels,
            datasets: [{
                label: 'Zafiyet Oranı (%)',
                data: stats.deptVulnerability.data,
                backgroundColor: gradient,
                borderRadius: 6,
                barThickness: 'flex'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// 4. Çizgi Grafik (Zaman Çizelgesi)
function initTimelineChart() {
    const ctx = document.getElementById('timelineChart').getContext('2d');
    const stats = dashboardData.stats;

    const gradientLine = ctx.createLinearGradient(0, 0, 0, 400);
    gradientLine.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
    gradientLine.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: stats.timelineData.labels,
            datasets: [{
                label: 'Linke Tıklayanlar (Kümülatif)',
                data: stats.timelineData.clicks,
                borderColor: '#ef4444',
                backgroundColor: gradientLine,
                borderWidth: 3,
                tension: 0.4, // Kavisli çizgi
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            }
        }
    });
}

// 5. Cihaz Dağılımı Grafiği (Ekstra)
function initDeviceChart() {
    const ctx = document.getElementById('deviceChart').getContext('2d');
    const stats = dashboardData.stats;

    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: stats.deviceData.labels,
            datasets: [{
                data: stats.deviceData.data,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.6)',
                    'rgba(16, 185, 129, 0.6)',
                    'rgba(245, 158, 11, 0.6)',
                    'rgba(139, 92, 246, 0.6)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    ticks: { display: false },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        }
    });
}

// 6. Tabloyu Doldur (Son Etkileşimler)
function initTable() {
    const tbody = document.getElementById('targetTableBody');
    tbody.innerHTML = '';
    const targets = dashboardData.targets;

    targets.forEach(target => {
        const tr = document.createElement('tr');

        let statusBadge = '';
        if (target.status === 'clicked') {
            statusBadge = '<span class="badge clicked">Tıkladı</span>';
        } else if (target.status === 'safe') {
            statusBadge = '<span class="badge safe">Tıklamadı/Raporladı</span>';
        } else {
            statusBadge = '<span class="badge sent">Gönderildi</span>';
        }

        tr.innerHTML = `
            <td style="font-weight: 500; color: #fff;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--card-border); display: flex; align-items: center; justify-content: center; font-size: 14px;">
                        ${target.name.charAt(0)}
                    </div>
                    ${target.name}
                </div>
            </td>
            <td>${target.department}</td>
            <td style="color: var(--text-muted);">${target.date}</td>
            <td style="color: var(--text-muted);"><i class="fa-solid fa-laptop" style="margin-right: 6px;"></i> ${target.device}</td>
            <td>${statusBadge}</td>
        `;

        tbody.appendChild(tr);
    });
}
