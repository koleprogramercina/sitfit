// ===== CONSTRUCTOR PAGE JS =====

(function() {
  'use strict';

  // ===== DATA =====
  const bases = [
    {
      id: 'oats-classic',
      name: 'Klasični Ovseni',
      detail: '50g ovsenih pahuljica',
      img: '/images/oatmeal-bowl.jpg',
      macros: { protein: 7, carbs: 30, fat: 4, calories: 185 }
    },
    {
      id: 'oats-express',
      name: 'Express Ovseni',
      detail: 'Instant priprema, ista vrednost',
      img: '/images/oatmeal-bowl.jpg',
      macros: { protein: 6, carbs: 28, fat: 3, calories: 163 }
    }
  ];

  const flavors = [
    {
      id: 'malina-vanila',
      name: 'Malina Vanila',
      detail: 'Sveža malina + kremasta vanila',
      img: '/images/product-malina.jpg',
      macros: { protein: 22, carbs: 12, fat: 3, calories: 163 }
    },
    {
      id: 'coko-visnja',
      name: 'Čoko Višnja',
      detail: 'Tamna čokolada + kisela višnja',
      img: '/images/product-coko.jpg',
      macros: { protein: 21, carbs: 14, fat: 5, calories: 185 }
    },
    {
      id: 'krem-bananica',
      name: 'Krem Bananica',
      detail: 'Kremasta banana + karamel niti',
      img: '/images/product-banana.jpg',
      macros: { protein: 20, carbs: 16, fat: 4, calories: 180 }
    },
    {
      id: 'jagoda-krem',
      name: 'Jagoda Krem',
      detail: 'Sveža jagoda + beli krem',
      img: '/images/product-malina.jpg',
      macros: { protein: 21, carbs: 13, fat: 3, calories: 163 }
    }
  ];

  const extras = [
    { id: 'chia', name: 'Chia Seme', icon: '🌱', macros: { protein: 2, carbs: 3, fat: 3, calories: 46 } },
    { id: 'hemp', name: 'Konoplja', icon: '💚', macros: { protein: 3, carbs: 1, fat: 3, calories: 43 } },
    { id: 'coconut', name: 'Kokosov Šećer', icon: '🥥', macros: { protein: 0, carbs: 5, fat: 0, calories: 18 } },
    { id: 'granola', name: 'Granola Mix', icon: '✨', macros: { protein: 2, carbs: 8, fat: 3, calories: 65 } },
    { id: 'nuts', name: 'Mešani Orasi', icon: '🥜', macros: { protein: 3, carbs: 2, fat: 8, calories: 89 } },
    { id: 'collagen', name: 'Kolagen', icon: '💎', macros: { protein: 5, carbs: 0, fat: 0, calories: 20 } }
  ];

  // ===== STATE =====
  let currentStep = 1;
  let selectedBase = null;
  let selectedFlavor = null;
  let selectedExtras = new Set();

  // ===== COMPUTED MACROS =====
  function getTotalMacros() {
    let total = { protein: 0, carbs: 0, fat: 0, calories: 0 };
    
    if (selectedBase) {
      const base = bases.find(b => b.id === selectedBase);
      if (base) {
        total.protein += base.macros.protein;
        total.carbs += base.macros.carbs;
        total.fat += base.macros.fat;
        total.calories += base.macros.calories;
      }
    }

    if (selectedFlavor) {
      const flavor = flavors.find(f => f.id === selectedFlavor);
      if (flavor) {
        total.protein += flavor.macros.protein;
        total.carbs += flavor.macros.carbs;
        total.fat += flavor.macros.fat;
        total.calories += flavor.macros.calories;
      }
    }

    selectedExtras.forEach(extraId => {
      const extra = extras.find(e => e.id === extraId);
      if (extra) {
        total.protein += extra.macros.protein;
        total.carbs += extra.macros.carbs;
        total.fat += extra.macros.fat;
        total.calories += extra.macros.calories;
      }
    });

    return total;
  }

  // ===== RENDER FUNCTIONS =====
  function renderStep1() {
    const container = document.getElementById('step1-options');
    if (!container) return;
    container.innerHTML = bases.map(base => `
      <div class="option-card ${selectedBase === base.id ? 'selected' : ''}" 
           data-base="${base.id}" onclick="selectBase('${base.id}')">
        <div class="option-img">
          <img src="${base.img}" alt="${base.name}" loading="lazy">
        </div>
        <div class="option-info">
          <div class="option-name">${base.name}</div>
          <div class="option-detail">${base.detail}</div>
        </div>
        <div class="option-check">${selectedBase === base.id ? '✓' : ''}</div>
      </div>
    `).join('');
  }

  function renderStep2() {
    const container = document.getElementById('step2-options');
    if (!container) return;
    container.innerHTML = flavors.map(flavor => `
      <div class="option-card ${selectedFlavor === flavor.id ? 'selected' : ''}" 
           data-flavor="${flavor.id}" onclick="selectFlavor('${flavor.id}')">
        <div class="option-img">
          <img src="${flavor.img}" alt="${flavor.name}" loading="lazy">
        </div>
        <div class="option-info">
          <div class="option-name">${flavor.name}</div>
          <div class="option-detail">${flavor.detail}</div>
        </div>
        <div class="option-check">${selectedFlavor === flavor.id ? '✓' : ''}</div>
      </div>
    `).join('');
  }

  function renderStep3() {
    const container = document.getElementById('step3-options');
    if (!container) return;
    container.innerHTML = extras.map(extra => `
      <div class="extra-card ${selectedExtras.has(extra.id) ? 'selected' : ''}" 
           onclick="toggleExtra('${extra.id}')">
        <span class="extra-icon">${extra.icon}</span>
        <div class="extra-name">${extra.name}</div>
      </div>
    `).join('');
  }

  function updatePreview() {
    const macros = getTotalMacros();

    // Update macro bars
    const maxProtein = 60, maxCarbs = 80, maxFat = 30;
    
    updateMacroBar('protein', macros.protein, maxProtein, 'proteinVal');
    updateMacroBar('carbs', macros.carbs, maxCarbs, 'carbsVal');
    updateMacroBar('fat', macros.fat, maxFat, 'fatVal');

    // Update calories
    const calEl = document.getElementById('totalCalories');
    if (calEl) animateNumber(calEl, macros.calories);

    // Update preview image based on flavor
    if (selectedFlavor) {
      const flavor = flavors.find(f => f.id === selectedFlavor);
      const previewImg = document.getElementById('previewImg');
      const previewLabel = document.getElementById('previewLabel');
      if (flavor && previewImg) {
        previewImg.src = flavor.img;
        previewImg.alt = flavor.name;
      }
      if (flavor && previewLabel) {
        previewLabel.textContent = flavor.name;
      }
    } else {
      const previewImg = document.getElementById('previewImg');
      const previewLabel = document.getElementById('previewLabel');
      if (previewImg) {
        previewImg.src = '/images/oatmeal-bowl.jpg';
      }
      if (previewLabel) previewLabel.textContent = 'Vaš Sit i Fit';
    }

    // Update selection tags
    updateSelectionTags();

    // Update next button state
    updateNextButton();
  }

  function updateMacroBar(name, value, max, valueId) {
    const fill = document.querySelector(`[data-bar="${name}"]`);
    const valEl = document.getElementById(valueId);
    if (fill) {
      const pct = Math.min((value / max) * 100, 100);
      fill.style.width = pct + '%';
    }
    if (valEl) animateNumber(valEl, value);
  }

  function animateNumber(el, target) {
    const current = parseInt(el.textContent) || 0;
    const diff = target - current;
    const steps = 20;
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 2);
      el.textContent = Math.round(current + diff * ease) + 'g';
      if (step >= steps) {
        el.textContent = target + 'g';
        clearInterval(interval);
      }
    }, 20);
  }

  function updateSelectionTags() {
    const container = document.getElementById('selectionTags');
    if (!container) return;

    const tags = [];
    
    if (selectedBase) {
      const b = bases.find(b => b.id === selectedBase);
      if (b) tags.push(`<span class="sel-tag">🌾 ${b.name}</span>`);
    } else {
      tags.push('<span class="sel-tag sel-tag-empty">Izaberi bazu...</span>');
    }

    if (selectedFlavor) {
      const f = flavors.find(f => f.id === selectedFlavor);
      if (f) tags.push(`<span class="sel-tag">🍓 ${f.name}</span>`);
    } else {
      tags.push('<span class="sel-tag sel-tag-empty">Izaberi ukus...</span>');
    }

    if (selectedExtras.size > 0) {
      selectedExtras.forEach(extraId => {
        const e = extras.find(e => e.id === extraId);
        if (e) tags.push(`<span class="sel-tag">${e.icon} ${e.name}</span>`);
      });
    }

    container.innerHTML = tags.join('');
  }

  function updateNextButton() {
    // Update all next buttons based on current step
    const btnIds = { 1: 'nextBtn', 2: 'nextBtn2', 3: 'nextBtn3' };
    const nextBtn = document.getElementById(btnIds[currentStep]);
    if (!nextBtn) return;
    
    const canNext = (
      (currentStep === 1 && selectedBase) ||
      (currentStep === 2 && selectedFlavor) ||
      (currentStep === 3)
    );
    
    nextBtn.disabled = !canNext;
  }

  function updateStepDots() {
    document.querySelectorAll('.step-dot').forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i + 1 === currentStep) dot.classList.add('active');
      else if (i + 1 < currentStep) dot.classList.add('done');
    });

    document.getElementById('stepLabel').textContent = `Korak ${currentStep} od 3`;
  }

  function goToStep(step) {
    // Hide all panels
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    
    // Show target
    const target = document.getElementById(`step${step}`);
    if (target) {
      target.classList.add('active');
      target.style.animationName = 'none';
      requestAnimationFrame(() => {
        target.style.animationName = '';
      });
    }

    currentStep = step;
    updateStepDots();
    updateNextButton();

    // Render appropriate step content
    if (step === 1) renderStep1();
    if (step === 2) renderStep2();
    if (step === 3) renderStep3();
  }

  // ===== GLOBAL SELECTION HANDLERS =====
  window.selectBase = function(id) {
    selectedBase = id;
    renderStep1();
    updatePreview();
  };

  window.selectFlavor = function(id) {
    selectedFlavor = id;
    renderStep2();
    updatePreview();
  };

  window.toggleExtra = function(id) {
    if (selectedExtras.has(id)) {
      selectedExtras.delete(id);
    } else {
      if (selectedExtras.size < 3) {
        selectedExtras.add(id);
      } else {
        // Show max toast
        showToast('Maksimalno 3 dodatka!');
        return;
      }
    }
    renderStep3();
    updatePreview();
  };

  window.nextStep = function() {
    if (currentStep < 3) {
      goToStep(currentStep + 1);
    } else {
      // Final - show order modal
      showOrderModal();
    }
  };

  window.prevStep = function() {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  // ===== TOAST =====
  function showToast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
      background: rgba(209,77,133,0.95); color: white; padding: 12px 24px;
      border-radius: 50px; font-family: Poppins, sans-serif; font-weight: 600;
      font-size: 14px; z-index: 9998; box-shadow: 0 8px 32px rgba(209,77,133,0.5);
      animation: fadeInUp 0.3s ease forwards;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  // ===== ORDER MODAL =====
  function showOrderModal() {
    const base = bases.find(b => b.id === selectedBase);
    const flavor = flavors.find(f => f.id === selectedFlavor);
    const extrasNames = Array.from(selectedExtras).map(id => {
      const e = extras.find(e => e.id === id);
      return e ? e.name : '';
    }).join(', ');

    const macros = getTotalMacros();

    let orderText = `Zdravo! Želim da naručim Sit i Fit obrok:\n\n`;
    orderText += `🌾 Baza: ${base ? base.name : '-'}\n`;
    orderText += `🍓 Ukus: ${flavor ? flavor.name : '-'}\n`;
    if (extrasNames) orderText += `✨ Dodaci: ${extrasNames}\n`;
    orderText += `\n📊 Makros: ${macros.protein}g proteina | ${macros.calories}g kalorija`;

    const encoded = encodeURIComponent(orderText);
    const igUrl = `https://www.instagram.com/direct/new/?text=${encoded}`;
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9997;
      background: rgba(0,0,0,0.85); backdrop-filter: blur(20px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: fadeIn 0.3s ease;
    `;
    
    overlay.innerHTML = `
      <div style="
        background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1);
        border-radius: 24px; padding: 40px; max-width: 480px; width: 100%;
        text-align: center; font-family: Poppins, sans-serif;
        box-shadow: 0 40px 100px rgba(0,0,0,0.8);
        position: relative;
      ">
        <button onclick="this.parentElement.parentElement.remove()" style="
          position: absolute; top: 16px; right: 16px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%; width: 36px; height: 36px; cursor: pointer;
          color: white; font-size: 16px; display: flex; align-items: center; justify-content: center;
        ">×</button>
        
        <div style="
          width: 64px; height: 64px; background: linear-gradient(135deg, #D14D85, #a83a6b);
          border-radius: 18px; display: flex; align-items: center; justify-content: center;
          font-size: 28px; margin: 0 auto 20px; box-shadow: 0 0 30px rgba(209,77,133,0.4);
        ">✅</div>
        
        <h3 style="font-size: 24px; font-weight: 800; color: white; margin-bottom: 8px; letter-spacing: -0.5px;">
          Tvoj obrok je spreman!
        </h3>
        <p style="font-size: 14px; color: rgba(255,255,255,0.6); margin-bottom: 24px; line-height: 1.6;">
          Kontaktiraj nas putem Instagrama da dokončaš porudžbinu. Priprema svakog dana sveže!
        </p>
        
        <div style="
          background: rgba(209,77,133,0.08); border: 1px solid rgba(209,77,133,0.2);
          border-radius: 16px; padding: 16px 20px; margin-bottom: 24px; text-align: left;
        ">
          <div style="font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">Tvoja Porudžbina</div>
          ${base ? `<div style="font-size: 13px; color: rgba(255,255,255,0.8); margin-bottom: 6px;">🌾 ${base.name}</div>` : ''}
          ${flavor ? `<div style="font-size: 13px; color: rgba(255,255,255,0.8); margin-bottom: 6px;">🍓 ${flavor.name}</div>` : ''}
          ${extrasNames ? `<div style="font-size: 13px; color: rgba(255,255,255,0.8); margin-bottom: 6px;">✨ ${extrasNames}</div>` : ''}
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; gap: 16px;">
            <div>
              <div style="font-size: 20px; font-weight: 800; color: #D14D85;">${macros.protein}g</div>
              <div style="font-size: 11px; color: rgba(255,255,255,0.4);">Proteini</div>
            </div>
            <div>
              <div style="font-size: 20px; font-weight: 800; color: #D14D85;">${macros.carbs}g</div>
              <div style="font-size: 11px; color: rgba(255,255,255,0.4);">Ugljeni hidrati</div>
            </div>
            <div>
              <div style="font-size: 20px; font-weight: 800; color: #D14D85;">${macros.calories}</div>
              <div style="font-size: 11px; color: rgba(255,255,255,0.4);">Kalorije</div>
            </div>
          </div>
        </div>
        
        <a href="https://instagram.com/sitifit.sm" target="_blank" style="
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; background: linear-gradient(135deg, #D14D85 0%, #a83a6b 100%);
          color: white; text-decoration: none; border-radius: 50px; padding: 16px;
          font-weight: 700; font-size: 15px; font-family: Poppins, sans-serif;
          box-shadow: 0 8px 32px rgba(209,77,133,0.5); transition: all 0.3s ease;
          cursor: pointer; margin-bottom: 12px;
        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Naruči putem Instagrama
        </a>
        
        <p style="font-size: 12px; color: rgba(255,255,255,0.3);">
          Ili nas pronađi na adresi · Sremska Mitrovica · Šabac · Šid
        </p>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }

  // ===== INIT =====
  function init() {
    renderStep1();
    updateStepDots();
    updatePreview();
    
    // Set default calories display
    const calEl = document.getElementById('totalCalories');
    if (calEl) calEl.textContent = '0g';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
