/**
 * 角色社区页面专用JS
 */

// 员工扩展数据（价格、描述等，不包含招募次数，招募次数从 config.js 获取）
const EMPLOYEE_DETAILS = {
  huaxiaoyi: { 
    desc: '行业资讯、作品点评、画作整理、海报文案，绘画工作室必备', 
    price: 298, 
    originalPrice: 368, 
    monthly: 69 
  },
  ajie: { 
    desc: '做网站、小程序、技术支持、自动化脚本，技术问题找他', 
    price: 268, 
    originalPrice: 338, 
    monthly: 49 
  },
  nuannuan: { 
    desc: '文案撰写、内容策划、翻译、数据分析，全能运营选手', 
    price: 248, 
    originalPrice: 318, 
    monthly: 49 
  },
  xiaowei: { 
    desc: '资料整理、表格处理、查信息、日程管理，靠谱助手', 
    price: 198, 
    originalPrice: 258, 
    monthly: 39 
  },
  laozhang: { 
    desc: '电脑故障排查、软件指导、系统优化，技术问题都懂', 
    price: 158, 
    originalPrice: 198, 
    monthly: 39 
  },
  fangjie: { 
    desc: '倾听烦恼、情绪疏导、聊天陪伴，知心姐姐', 
    price: 98, 
    originalPrice: 128, 
    monthly: 29 
  }
};

// 合并配置数据生成完整员工列表
function getEmployeeList() {
  if (typeof EMPLOYEE_CONFIG === 'undefined') return [];
  
  return Object.values(EMPLOYEE_CONFIG.employees).map(emp => {
    const details = EMPLOYEE_DETAILS[emp.id] || {};
    return {
      ...emp,
      ...details
    };
  });
}

let currentPage = 1;
const pageSize = 10;
let sortField = 'hired';
let sortOrder = 'desc';

function sortBy(field) {
  if (sortField === field) {
    sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
  } else {
    sortField = field;
    sortOrder = 'desc';
  }
  
  updateSortUI();
  renderEmployees();
  renderPagination();
}

function updateSortUI() {
  const hiredEl = document.getElementById('sortHired');
  const priceEl = document.getElementById('sortPrice');
  
  if (!hiredEl || !priceEl) return;
  
  hiredEl.className = 'sort-item' + (sortField === 'hired' ? ' active' : '');
  priceEl.className = 'sort-item' + (sortField === 'price' ? ' active' : '');
  
  const arrow = sortOrder === 'desc' ? '↓' : '↑';
  hiredEl.innerHTML = '按被招募次数 <span class="sort-arrow">' + (sortField === 'hired' ? arrow : '') + '</span>';
  priceEl.innerHTML = '按价格 <span class="sort-arrow">' + (sortField === 'price' ? arrow : '') + '</span>';
}

function sortEmployees(employees) {
  return employees.sort((a, b) => {
    let diff = a[sortField] - b[sortField];
    return sortOrder === 'asc' ? diff : -diff;
  });
}

function renderEmployees() {
  const container = document.getElementById('employee-list-container');
  if (!container) return;
  
  const employees = sortEmployees(getEmployeeList());
  
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageEmployees = employees.slice(start, end);
  
  container.innerHTML = pageEmployees.map(emp => `
    <div class="employee-row">
      <div class="employee-row-avatar ${emp.id}"></div>
      <div class="employee-row-info">
        <h3>${emp.name} <span class="role-tag">${emp.role}</span></h3>
        <p>${emp.desc}</p>
      </div>
      <div class="employee-row-price">
        <div class="price"><span style="text-decoration:line-through;color:#64748b;font-size:14px;">¥${emp.originalPrice}</span> ¥${emp.price} <span>/ ¥${emp.monthly}月</span></div>
        <div class="hired-count">已被招募 <strong>${emp.hired}</strong> 次</div>
      </div>
      <a href="employee-${emp.id}.html" class="hire-button">招募</a>
    </div>
  `).join('');
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;
  
  const employees = getEmployeeList();
  const totalPages = Math.ceil(employees.length / pageSize);
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  let html = '';
  html += `<button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>上一页</button>`;
  
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  
  html += `<button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>下一页</button>`;
  
  pagination.innerHTML = html;
}

function goToPage(page) {
  const employees = getEmployeeList();
  const totalPages = Math.ceil(employees.length / pageSize);
  
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  renderEmployees();
  renderPagination();
  
  document.querySelector('.employee-list').scrollIntoView({ behavior: 'smooth' });
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  renderEmployees();
  renderPagination();
});
