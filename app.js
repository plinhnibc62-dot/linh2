document.addEventListener('DOMContentLoaded', () => {
  
  // ================= STATE MANAGEMENT =================
  const screens = [
    'splash-screen',
    'login-screen',
    'home-screen',
    'discovery-screen',
    'blueprint-screen',
    'dashboard-screen',
    'celebration-screen'
  ];
  let currentScreenIdx = 0;

  // Selected Goal variables in-memory
  let selectedGoalText = "Du lịch Nhật";
  let selectedGoalEmoji = "🇯🇵";
  let isBalanceMasked = true; // Match home_2.jpg reference default state

  // ================= GENERAL HELPERS =================
  
  // Navigation Function
  window.navigateTo = function(screenId) {
    const targetIdx = screens.indexOf(screenId);
    if (targetIdx === -1) return;

    const currentScreenId = screens[currentScreenIdx];
    const currentEl = document.getElementById(currentScreenId);
    const targetEl = document.getElementById(screenId);

    if (!currentEl || !targetEl) return;

    // Reset transition classes
    screens.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('active', 'slide-left', 'slide-right');
      }
    });

    // Apply direction slide
    if (targetIdx > currentScreenIdx) {
      currentEl.classList.add('slide-left');
      targetEl.classList.add('slide-right');
    } else if (targetIdx < currentScreenIdx) {
      currentEl.classList.add('slide-right');
      targetEl.classList.add('slide-left');
    }

    // Force reflow
    targetEl.offsetHeight;

    // Make target active
    targetEl.classList.add('active');
    currentScreenIdx = targetIdx;

    // Synchronize bottom nav bars highlights across screens
    syncBottomNavBars(screenId);

    // Screen specific triggers
    if (screenId === 'blueprint-screen') {
      initBlueprintScreen();
    } else if (screenId === 'dashboard-screen') {
      initDashboardScreen();
    } else if (screenId === 'celebration-screen') {
      initCelebrationScreen();
      setTimeout(triggerConfetti, 100);
    }
  };

  // Sync bottom nav links highlights
  function syncBottomNavBars(activeScreenId) {
    const allNavItems = document.querySelectorAll('.bottom-nav-item');
    allNavItems.forEach(item => {
      const targetScreen = item.getAttribute('data-screen');
      
      // Treat savings-related screens as the "TIẾT KIỆM" flow
      let isMatch = false;
      if (targetScreen === 'discovery-screen' && 
          ['discovery-screen', 'blueprint-screen', 'dashboard-screen'].includes(activeScreenId)) {
        isMatch = true;
      } else if (targetScreen === activeScreenId) {
        isMatch = true;
      }

      if (isMatch) {
        item.classList.add('text-[#FF007F]', 'font-extrabold');
        item.classList.remove('text-slate-400');
      } else {
        item.classList.remove('text-[#FF007F]', 'font-extrabold');
        item.classList.add('text-slate-400');
      }
    });
  }

  // Toast notifier
  window.showToast = function(message) {
    const toast = document.createElement('div');
    toast.className = 'absolute top-12 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-xs px-4 py-2.5 rounded-full shadow-lg z-50 flex items-center gap-2 animate-fade-in-up font-medium border border-slate-800';
    toast.innerHTML = `
      <span>🍰</span>
      <span>${message}</span>
    `;
    const container = document.querySelector('.screen-container') || document.body;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', '-translate-y-2');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2500);
  };

  // Bind all bottom nav clicks
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
  bottomNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetScreen = item.getAttribute('data-screen');
      if (targetScreen === 'advance-screen') {
        showToast("Tính năng Ứng Trước đang được phát triển!");
      } else if (targetScreen === 'invest-screen') {
        showToast("Tính năng Đầu Tư đang được phát triển!");
      } else if (targetScreen) {
        navigateTo(targetScreen);
      }
    });
  });

  // ================= SCREEN 1: SPLASH SCREEN =================
  const splashScreenEl = document.getElementById('splash-screen');
  if (splashScreenEl) {
    // Click anywhere to skip splash as fallback
    splashScreenEl.addEventListener('click', () => {
      if (currentScreenIdx === 0) {
        navigateTo('login-screen');
      }
    });
  }

  // ================= SCREEN 2: LOGIN INPUT SCREEN =================
  const loginForm = document.getElementById('login-form');
  const loginPhone = document.getElementById('login-phone');
  const loginPin = document.getElementById('login-pin');
  
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (loginPhone.value.trim() === "" || loginPin.value.trim() === "") {
        showToast("Vui lòng nhập đầy đủ số điện thoại và mã PIN!");
        return;
      }
      navigateTo('home-screen');
    });
  }

  // ================= SCREEN 3: INTEGRATED HOME SCREEN =================
  const toggleBalanceBtn = document.getElementById('toggle-balance-btn');
  const balanceValue = document.getElementById('balance-value');
  
  if (toggleBalanceBtn && balanceValue) {
    const updateBalanceUI = () => {
      if (isBalanceMasked) {
        balanceValue.innerText = "**********";
        toggleBalanceBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.574 1 1 0 0 1 0 .7a10.735 10.735 0 0 1-2.905 4.144"/><path d="M10.49 10.49a3.003 3.003 0 0 0 4.02 4.02"/><path d="M2 2l22 22"/><path d="M3.51 9.57a10.744 10.744 0 0 0 1.34 3.73 1 1 0 0 0 0 .7 10.735 10.735 0 0 0 9.25 5.36 10.712 10.712 0 0 0 3.73-1.34"/></svg>
        `;
      } else {
        balanceValue.innerText = "42.500.000";
        toggleBalanceBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        `;
      }
    };

    updateBalanceUI();

    toggleBalanceBtn.addEventListener('click', () => {
      isBalanceMasked = !isBalanceMasked;
      updateBalanceUI();
    });
  }

  // AI companion card CTA
  const homeSaveNowBtn = document.getElementById('home-save-now-btn');
  if (homeSaveNowBtn) {
    homeSaveNowBtn.addEventListener('click', () => {
      navigateTo('discovery-screen');
    });
  }

  // ================= SCREEN 4: GOAL DISCOVERY & CHATBOT =================
  const goalCards = document.querySelectorAll('.goal-card');
  const goalGrid = document.getElementById('goal-grid');
  const chatContainer = document.getElementById('chat-container');
  const chatMessagesList = document.getElementById('chat-messages');
  const chatOptionsContainer = document.getElementById('chat-options');
  const discoveryHeading = document.getElementById('discovery-heading');
  const backToGridBtn = document.getElementById('back-to-grid-btn');
  const backToHomeLink = document.getElementById('back-to-home-link');

  goalCards.forEach(card => {
    card.addEventListener('click', () => {
      selectedGoalText = card.getAttribute('data-goal-text');
      selectedGoalEmoji = card.getAttribute('data-goal-emoji');
      startGoalChat();
    });
  });

  if (backToGridBtn) {
    backToGridBtn.addEventListener('click', () => {
      resetToGoalGrid();
    });
  }

  function startGoalChat() {
    goalGrid.classList.add('hidden');
    discoveryHeading.classList.add('hidden');
    backToGridBtn.classList.remove('hidden');
    backToHomeLink.classList.add('hidden');
    chatContainer.classList.remove('hidden');

    chatMessagesList.innerHTML = '';
    chatOptionsContainer.innerHTML = '';

    showAIQuery(`Tuyệt vời! Kế hoạch tích lũy <strong>${selectedGoalEmoji} ${selectedGoalText}</strong> là một ý tưởng xuất sắc. Bạn dự kiến khi nào sẽ bắt đầu chuyến đi hoặc hoàn thành mục tiêu này?`, [
      { text: "Tháng 06/2028 (Khuyên dùng)", value: "06/2028" },
      { text: "Cuối năm sau (12/2027)", value: "12/2027" },
      { text: "Tự nhập mốc khác", value: "custom" }
    ], handleStep1Response);
  }

  function resetToGoalGrid() {
    goalGrid.classList.remove('hidden');
    discoveryHeading.classList.remove('hidden');
    backToGridBtn.classList.add('hidden');
    backToHomeLink.classList.remove('hidden');
    chatContainer.classList.add('hidden');
  }

  function showAIQuery(text, options, callback) {
    // Add typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'flex items-start gap-2 mb-4 animate-fade-in-up';
    typingIndicator.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center shrink-0 border border-pink-200">
        <svg width="20" height="20" viewBox="0 0 100 100" class="w-5 h-5">
          <circle cx="50" cy="50" r="40" fill="#FF007F"/>
          <circle cx="35" cy="45" r="5" fill="white"/>
          <circle cx="65" cy="45" r="5" fill="white"/>
          <ellipse cx="50" cy="65" rx="10" ry="6" fill="white"/>
        </svg>
      </div>
      <div class="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-2xl rounded-tl-none text-sm shadow-sm max-w-[80%]">
        <div class="flex items-center gap-1">
          <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0s"></span>
          <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
          <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
        </div>
      </div>
    `;
    chatMessagesList.appendChild(typingIndicator);
    scrollChatBottom();

    setTimeout(() => {
      chatMessagesList.removeChild(typingIndicator);

      const bubble = document.createElement('div');
      bubble.className = 'flex items-start gap-2 mb-4 animate-fade-in-up';
      bubble.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center shrink-0 border border-pink-200">
          <svg width="20" height="20" viewBox="0 0 100 100" class="w-5 h-5">
            <circle cx="50" cy="50" r="40" fill="#FF007F"/>
            <circle cx="35" cy="45" r="5" fill="white"/>
            <circle cx="65" cy="45" r="5" fill="white"/>
            <ellipse cx="50" cy="65" rx="10" ry="6" fill="white"/>
          </svg>
        </div>
        <div class="bg-slate-100 text-slate-800 px-4 py-2.5 rounded-2xl rounded-tl-none text-sm shadow-sm max-w-[80%] leading-relaxed">
          ${text}
        </div>
      `;
      chatMessagesList.appendChild(bubble);
      scrollChatBottom();

      renderOptions(options, callback);
    }, 1000);
  }

  function renderOptions(options, callback) {
    chatOptionsContainer.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'w-full text-left bg-white hover:bg-pink-50 border border-slate-200 hover:border-[#FF007F] text-slate-700 hover:text-[#FF007F] px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-between group';
      btn.innerHTML = `
        <span>${opt.text}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-slate-400 group-hover:text-[#FF007F] transition-colors"><path d="m9 18 6-6-6-6"/></svg>
      `;
      btn.addEventListener('click', () => {
        addUserMessage(opt.text);
        chatOptionsContainer.innerHTML = '';
        callback(opt.value);
      });
      chatOptionsContainer.appendChild(btn);
    });
  }

  function addUserMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'flex items-start justify-end gap-2 mb-4 animate-fade-in-up';
    bubble.innerHTML = `
      <div class="bg-[#FF007F] text-white px-4 py-2.5 rounded-2xl rounded-tr-none text-sm shadow-sm max-w-[85%] leading-relaxed">
        ${text}
      </div>
      <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
        <span class="text-xs font-semibold text-slate-600">Me</span>
      </div>
    `;
    chatMessagesList.appendChild(bubble);
    scrollChatBottom();
  }

  function scrollChatBottom() {
    const scrollContainer = chatContainer.closest('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }

  function handleStep1Response(value) {
    setTimeout(() => {
      showAIQuery("Mục tiêu này bạn dự tính tích lũy tổng cộng bao nhiêu tiền nè?", [
        { text: "42.000.000 VND (Đã tính trượt giá)", value: "42000000" },
        { text: "30.000.000 VND (Tiết kiệm tối giản)", value: "30000000" },
        { text: "Nhập số tiền khác", value: "custom_amount" }
      ], handleStep2Response);
    }, 500);
  }

  function handleStep2Response(value) {
    setTimeout(() => {
      showAIQuery("AIgoal mate nhận thấy dòng tiền hàng tháng của bạn khá ổn định. Bạn muốn mình đề xuất một lộ trình thông minh phù hợp hay tự điều chỉnh?", [
        { text: "Cake Đề xuất thông minh (Khuyên dùng)", value: "ai_proposal" },
        { text: "Tự điều chỉnh thủ công", value: "manual" }
      ], handleStep3Response);
    }, 500);
  }

  function handleStep3Response(value) {
    setTimeout(() => {
      const bubble = document.createElement('div');
      bubble.className = 'flex items-start gap-2 mb-4 animate-fade-in-up';
      bubble.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center border border-pink-200 shrink-0">
          <svg width="20" height="20" viewBox="0 0 100 100" class="w-5 h-5">
            <circle cx="50" cy="50" r="40" fill="#FF007F"/>
            <circle cx="35" cy="45" r="5" fill="white"/>
            <circle cx="65" cy="45" r="5" fill="white"/>
            <ellipse cx="50" cy="65" rx="10" ry="6" fill="white"/>
          </svg>
        </div>
        <div class="bg-pastel-pink-purple border border-pink-100 text-slate-800 px-4 py-2.5 rounded-2xl rounded-tl-none text-sm shadow-sm max-w-[80%] leading-relaxed">
          ✨ AIgoal mate đang phân tích dữ liệu chi tiêu và tạo Blueprint tối ưu nhất cho bạn...
        </div>
      `;
      chatMessagesList.appendChild(bubble);
      scrollChatBottom();

      setTimeout(() => {
        navigateTo('blueprint-screen');
      }, 1500);
    }, 500);
  }

  // ================= SCREEN 5: AI SAVING BLUEPRINT =================
  function initBlueprintScreen() {
    const bpGoalName = document.getElementById('bp-goal-name');
    if (bpGoalName) {
      bpGoalName.innerHTML = `<span>${selectedGoalEmoji}</span> ${selectedGoalText}`;
    }
  }

  const startBlueprintBtn = document.getElementById('start-blueprint-btn');
  if (startBlueprintBtn) {
    startBlueprintBtn.addEventListener('click', () => {
      navigateTo('dashboard-screen');
    });
  }

  // ================= SCREEN 6: GOAL PROGRESS & ADAPTIVE DASHBOARD =================
  const acceptReplanningBtn = document.getElementById('accept-replanning-btn');
  const replanningModal = document.getElementById('replanning-modal');
  const dashboardProgressFill = document.getElementById('dashboard-progress-fill');
  const dashboardProgressText = document.getElementById('dashboard-progress-text');
  const savedAmountEl = document.getElementById('saved-amount-el');
  const predictionWidgetText = document.getElementById('prediction-widget-text');

  function initDashboardScreen() {
    const dbGoalName = document.getElementById('db-goal-name');
    if (dbGoalName) {
      dbGoalName.innerHTML = `<span>${selectedGoalEmoji}</span> ${selectedGoalText}`;
    }
    
    // Dynamic default metrics based on goal selected
    if (selectedGoalText !== "Du lịch Nhật") {
      if (savedAmountEl) savedAmountEl.innerText = "0đ";
      if (dashboardProgressFill) dashboardProgressFill.style.width = "0%";
      if (dashboardProgressText) dashboardProgressText.innerText = "0%";
      if (replanningModal) replanningModal.style.display = 'none'; // Only show demo modal for Japan Trip
    } else {
      // Reset to original states in case re-opened
      if (savedAmountEl) savedAmountEl.innerText = "30.240.000đ";
      if (dashboardProgressFill) dashboardProgressFill.style.width = "72%";
      if (dashboardProgressText) dashboardProgressText.innerText = "72%";
      if (replanningModal) {
        replanningModal.style.display = 'block';
        replanningModal.classList.remove('scale-95', 'opacity-0');
      }
      if (acceptReplanningBtn) {
        acceptReplanningBtn.innerText = "Đồng ý cập nhật lộ trình mới";
        acceptReplanningBtn.disabled = false;
        acceptReplanningBtn.className = "w-full bg-[#FF007F] hover:bg-cakePinkHover text-white py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-md transition-all quick-action-btn";
      }
      if (predictionWidgetText) {
        predictionWidgetText.innerHTML = `Nếu giữ vững nhịp hiện tại, bạn sẽ <strong class="text-[#FF007F] font-bold">hoàn thành sớm hơn 16 ngày</strong> so với kế hoạch ban đầu!`;
      }
    }
  }

  if (acceptReplanningBtn && replanningModal) {
    acceptReplanningBtn.addEventListener('click', () => {
      acceptReplanningBtn.innerText = "Đã cập nhật ✓";
      acceptReplanningBtn.disabled = true;
      acceptReplanningBtn.classList.remove('bg-[#FF007F]');
      acceptReplanningBtn.classList.add('bg-emerald-500', 'text-white');

      setTimeout(() => {
        replanningModal.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
          replanningModal.style.display = 'none';
        }, 300);

        if (savedAmountEl) savedAmountEl.innerText = "32.240.000đ";
        if (dashboardProgressFill) dashboardProgressFill.style.width = "77%";
        if (dashboardProgressText) dashboardProgressText.innerText = "77%";
        if (predictionWidgetText) {
          predictionWidgetText.innerHTML = "🎯 Kế hoạch đã được tối ưu hóa theo dòng tiền thực tế mới của bạn.";
        }

        showToast("Đã kích hoạt lộ trình tiết kiệm thích ứng thành công!");
      }, 1000);
    });
  }

  // Developer trigger to celebrate
  const triggerCelebrationBtn = document.getElementById('trigger-celebration-btn');
  if (triggerCelebrationBtn) {
    triggerCelebrationBtn.addEventListener('click', () => {
      navigateTo('celebration-screen');
    });
  }

  // ================= SCREEN 7: GOAL CELEBRATION =================
  function initCelebrationScreen() {
    const cbGoalName = document.getElementById('cb-goal-name');
    if (cbGoalName) {
      cbGoalName.innerText = `Goal ${selectedGoalText}`;
    }
    const cbMascotBadge = document.getElementById('cb-mascot-badge');
    if (cbMascotBadge) {
      cbMascotBadge.innerHTML = `
        ${selectedGoalEmoji}
        <span class="absolute -top-1 -right-1 text-2xl animate-bounce-soft">🎉</span>
        <span class="absolute -bottom-1 -left-1 text-2xl" style="animation-delay: 0.5s">✨</span>
      `;
    }
  }

  const startNextGoalBtn = document.getElementById('start-next-goal-btn');
  if (startNextGoalBtn) {
    startNextGoalBtn.addEventListener('click', () => {
      resetToGoalGrid();
      navigateTo('discovery-screen');
    });
  }

  // Confetti Particle Canvas
  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    let particles = [];
    const colors = ['#FF007F', '#7000FF', '#00F0FF', '#FFD700', '#10B981', '#F59E0B'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -100 - 10,
        r: Math.random() * 5 + 3,
        w: Math.random() * 12 + 6,
        h: Math.random() * 8 + 4,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.05 + 0.02,
        tiltAngle: Math.random() * Math.PI,
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1
      });
    }

    let animationId;
    let startTime = Date.now();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.tiltAngle) * 0.5;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        if (p.y < canvas.height) {
          active = true;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tiltAngle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (active && (Date.now() - startTime < 4000)) {
        animationId = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationId);
      }
    }
    draw();
  }

});
