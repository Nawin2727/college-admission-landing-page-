/* ==========================================================================
   College Admission Digital Marketing Campaign Website Script
   Handles: Interactive UI, Form Validation, Lead LocalStorage, Event Tracking,
            UTM Parameter Parsing, and Campaign Analytics HUD.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. DIGITAL MARKETING EVENT TRACKING & STATE MANAGEMENT
    // ----------------------------------------------------------------------
    const trackingState = {
        totalClicks: 0,
        applyClicks: 0,
        enquireClicks: 0,
        leadsSubmitted: 0,
        eventsLog: []
    };

    // Load existing leads from localStorage if available
    const getStoredLeads = () => {
        try {
            return JSON.parse(localStorage.getItem('college_admissions_leads')) || [];
        } catch (e) {
            return [];
        }
    };

    const saveLeadToStorage = (leadData) => {
        const currentLeads = getStoredLeads();
        currentLeads.unshift(leadData);
        localStorage.setItem('college_admissions_leads', JSON.stringify(currentLeads));
        updateAnalyticsUI();
    };

    // Parse UTM Parameters from URL
    const parseUTMParameters = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source') || 'Direct / Organic';
        const utmMedium = urlParams.get('utm_medium') || 'Campaign Landing';
        const utmCampaign = urlParams.get('utm_campaign') || 'Admissions_2026';

        const utmLabel = document.getElementById('utm-source-label');
        if (utmLabel) {
            utmLabel.textContent = `${utmSource} (${utmMedium} - ${utmCampaign})`;
        }
        return { utmSource, utmMedium, utmCampaign };
    };

    const currentUTM = parseUTMParameters();

    // Universal Event Tracking Dispatcher
    const trackEvent = (eventName, extraData = {}) => {
        trackingState.totalClicks++;
        if (eventName.includes('apply')) trackingState.applyClicks++;
        if (eventName.includes('enquire')) trackingState.enquireClicks++;

        const eventEntry = {
            event: eventName,
            timestamp: new Date().toLocaleTimeString(),
            utm: currentUTM.utmSource,
            ...extraData
        };

        trackingState.eventsLog.unshift(eventEntry);

        // Simulated Google Analytics & Meta Pixel Console Tracing
        console.log(`[DIGITAL MARKETING EVENT LOGGED]: ${eventName}`, eventEntry);
        
        // Show Toast Notification for demonstration
        showToast(`Tracking Event: ${eventName.replace(/_/g, ' ').toUpperCase()}`);
        updateAnalyticsUI();
    };

    // Attach Click Event Listeners to all tracked elements
    document.querySelectorAll('.track-click').forEach(element => {
        element.addEventListener('click', (e) => {
            const eventName = element.getAttribute('data-event') || 'generic_click';
            const courseName = element.getAttribute('data-course') || null;
            trackEvent(eventName, { course: courseName });
        });
    });

    // Toast Notification System
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i data-lucide="activity"></i> <span>${message}</span>`;
        container.appendChild(toast);

        // Render Lucide icon
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // Update Campaign Analytics HUD UI
    function updateAnalyticsUI() {
        const leads = getStoredLeads();
        trackingState.leadsSubmitted = leads.length;

        const countBadge = document.getElementById('conversion-count');
        if (countBadge) countBadge.textContent = `${leads.length} Leads`;

        const totalClicksEl = document.getElementById('total-clicks-count');
        const applyClicksEl = document.getElementById('apply-clicks-count');
        const enquireClicksEl = document.getElementById('enquire-clicks-count');
        const leadsSubmittedEl = document.getElementById('leads-submitted-count');
        const funnelLeadCount = document.getElementById('funnel-lead-count');
        const funnelEnquiryCount = document.getElementById('funnel-enquiry-count');

        if (totalClicksEl) totalClicksEl.textContent = trackingState.totalClicks;
        if (applyClicksEl) applyClicksEl.textContent = trackingState.applyClicks;
        if (enquireClicksEl) enquireClicksEl.textContent = trackingState.enquireClicks;
        if (leadsSubmittedEl) leadsSubmittedEl.textContent = trackingState.leadsSubmitted;
        if (funnelLeadCount) funnelLeadCount.textContent = `${leads.length} Leads`;
        if (funnelEnquiryCount) funnelEnquiryCount.textContent = `${trackingState.enquireClicks + trackingState.applyClicks} Clicks`;

        // Render Leads Table in HUD
        const tableBody = document.getElementById('leads-table-body');
        if (tableBody) {
            if (leads.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No leads submitted yet in this session. Submit the Enquiry form to test!</td></tr>`;
            } else {
                tableBody.innerHTML = leads.map(lead => `
                    <tr>
                        <td>${lead.submittedAt}</td>
                        <td><strong>${escapeHTML(lead.name)}</strong></td>
                        <td>${escapeHTML(lead.phone)}</td>
                        <td>${escapeHTML(lead.course)}</td>
                        <td><span class="badge badge-primary">${escapeHTML(lead.utmSource)}</span></td>
                    </tr>
                `).join('');
            }
        }
    }

    function escapeHTML(str) {
        return str ? str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        ) : '';
    }

    // ----------------------------------------------------------------------
    // 2. STICKY NAVBAR & MOBILE MENU TOGGLE
    // ----------------------------------------------------------------------
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    if (mobileToggleBtn && navMenu) {
        mobileToggleBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggleBtn.querySelector('i');
            if (icon) {
                const isOpened = navMenu.classList.contains('active');
                icon.setAttribute('data-lucide', isOpened ? 'x' : 'menu');
                if (window.lucide) lucide.createIcons();
            }
        });
    }

    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileToggleBtn?.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    if (window.lucide) lucide.createIcons();
                }
            }
        });
    });

    // Highlight active nav section on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    });

    // ----------------------------------------------------------------------
    // 3. COURSE MODAL DISPATCHER
    // ----------------------------------------------------------------------
    const courseModal = document.getElementById('course-modal');
    const closeCourseModalBtn = document.getElementById('close-course-modal');
    const modalCloseAction = document.getElementById('modal-close-action');
    const modalCourseTitle = document.getElementById('modal-course-title');
    const modalCourseDesc = document.getElementById('modal-course-desc');

    const courseDetailsMap = {
        'B.E. Computer Science and Engineering': {
            title: 'B.E. Computer Science and Engineering',
            duration: '4 Academic Years (8 Semesters)',
            eligibility: '10+2 with Physics, Chemistry & Mathematics (Min 50% Marks)',
            desc: '[Editable Content] Designed to equip students with software architectural principles, data structures, cloud infrastructure, AI models, full-stack web development, and database administration.',
            modules: ['Data Structures & Algorithms', 'Operating Systems & Cloud Architecture', 'Web Technologies & Frameworks', 'Database Management & Analytics', 'Artificial Intelligence Fundamentals']
        },
        'B.E. Electronics and Communication Engineering': {
            title: 'B.E. Electronics and Communication Engineering',
            duration: '4 Academic Years (8 Semesters)',
            eligibility: '10+2 with Physics, Chemistry & Mathematics (Min 50% Marks)',
            desc: '[Editable Content] Focuses on microprocessors, wireless communication systems, VLSI design, signal processing, and IoT hardware embedded engineering.',
            modules: ['Analog & Digital Electronics', 'Microcontrollers & Embedded C', 'Wireless & Mobile Communication', 'VLSI System Design', 'Signal Processing & IoT Networks']
        },
        'B.E. Mechanical Engineering': {
            title: 'B.E. Mechanical Engineering',
            duration: '4 Academic Years (8 Semesters)',
            eligibility: '10+2 with Physics, Chemistry & Mathematics (Min 50% Marks)',
            desc: '[Editable Content] Comprehensive program covering solid mechanics, thermodynamics, fluid dynamics, CAD/CAM computer modeling, robotics, and industrial production engineering.',
            modules: ['Thermodynamics & Heat Transfer', 'CAD/CAM Solid Modeling', 'Robotics & Industrial Automation', 'Fluid Mechanics & Turbomachinery', 'Manufacturing Technology']
        },
        'B.Tech Artificial Intelligence and Data Science': {
            title: 'B.Tech Artificial Intelligence and Data Science',
            duration: '4 Academic Years (8 Semesters)',
            eligibility: '10+2 with Physics, Chemistry & Mathematics (Min 50% Marks)',
            desc: '[Editable Content] Specialized curriculum covering modern data pipelines, machine learning models, neural networks, natural language processing, and big data management.',
            modules: ['Python for Data Science & ML', 'Deep Learning & Neural Networks', 'Big Data Engineering & Pipelines', 'Natural Language Processing', 'Computer Vision Applications']
        }
    };

    document.querySelectorAll('.open-course-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const courseKey = btn.getAttribute('data-course');
            const data = courseDetailsMap[courseKey];

            if (data && courseModal) {
                if (modalCourseTitle) modalCourseTitle.textContent = data.title;
                const dur = document.getElementById('modal-course-duration');
                const elig = document.getElementById('modal-course-eligibility');
                const mods = document.getElementById('modal-course-modules');

                if (dur) dur.textContent = data.duration;
                if (elig) elig.textContent = data.eligibility;
                if (modalCourseDesc) modalCourseDesc.textContent = data.desc;
                if (mods) {
                    mods.innerHTML = data.modules.map(m => `<li><i data-lucide="check"></i> ${m}</li>`).join('');
                    if (window.lucide) lucide.createIcons();
                }

                const modalApplyBtn = document.getElementById('modal-apply-btn');
                if (modalApplyBtn) {
                    modalApplyBtn.setAttribute('data-course', data.title);
                }

                courseModal.classList.remove('hide');
                trackEvent('view_course_details', { course: data.title });
            }
        });
    });

    const closeCourseModal = () => courseModal && courseModal.classList.add('hide');
    if (closeCourseModalBtn) closeCourseModalBtn.addEventListener('click', closeCourseModal);
    if (modalCloseAction) modalCloseAction.addEventListener('click', closeCourseModal);

    // Auto select course in Enquiry Form when clicking 'Apply Now' on Course Card
    document.querySelectorAll('.select-course-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const courseName = btn.getAttribute('data-course');
            const courseSelect = document.getElementById('interestedCourse');
            if (courseSelect && courseName) {
                courseSelect.value = courseName;
            }
        });
    });

    const modalApplyBtn = document.getElementById('modal-apply-btn');
    if (modalApplyBtn) {
        modalApplyBtn.addEventListener('click', () => {
            const courseName = modalApplyBtn.getAttribute('data-course');
            const courseSelect = document.getElementById('interestedCourse');
            if (courseSelect && courseName) {
                courseSelect.value = courseName;
            }
            closeCourseModal();
        });
    }

    // ----------------------------------------------------------------------
    // 4. FAQ ACCORDION INTERACTION
    // ----------------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ----------------------------------------------------------------------
    // 5. ADMISSION ENQUIRY FORM VALIDATION & LEAD SUBMISSION
    // ----------------------------------------------------------------------
    const enquiryForm = document.getElementById('admission-enquiry-form');
    const successMsgBox = document.getElementById('enquiry-success-message');
    const resetFormBtn = document.getElementById('reset-form-btn');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous errors
            document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

            const nameInput = document.getElementById('studentName');
            const phoneInput = document.getElementById('phoneNumber');
            const emailInput = document.getElementById('emailAddress');
            const cityInput = document.getElementById('cityName');
            const qualSelect = document.getElementById('qualification');
            const courseSelect = document.getElementById('interestedCourse');

            let isValid = true;

            // Name Validation
            if (!nameInput.value.trim()) {
                showError('name-error', nameInput);
                isValid = false;
            }

            // Phone Validation (simple 10 digit check)
            const phoneVal = phoneInput.value.trim();
            if (!phoneVal || !/^\d{10}$/.test(phoneVal.replace(/[- ]/g, ''))) {
                showError('phone-error', phoneInput);
                isValid = false;
            }

            // Email Validation
            const emailVal = emailInput.value.trim();
            if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                showError('email-error', emailInput);
                isValid = false;
            }

            // City Validation
            if (!cityInput.value.trim()) {
                showError('city-error', cityInput);
                isValid = false;
            }

            // Qualification Validation
            if (!qualSelect.value) {
                showError('qual-error', qualSelect);
                isValid = false;
            }

            // Course Selection Validation
            if (!courseSelect.value) {
                showError('course-error', courseSelect);
                isValid = false;
            }

            if (isValid) {
                // Generate Lead Reference Code
                const leadRefCode = 'LEAD-2026-' + Math.random().toString(36).substring(2, 6).toUpperCase();
                const leadData = {
                    leadId: leadRefCode,
                    name: nameInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    email: emailInput.value.trim(),
                    city: cityInput.value.trim(),
                    qualification: qualSelect.value,
                    course: courseSelect.value,
                    utmSource: currentUTM.utmSource,
                    submittedAt: new Date().toLocaleTimeString()
                };

                // Save Lead & Dispatch Marketing Event
                saveLeadToStorage(leadData);
                trackEvent('enquiry_form_submission', leadData);

                // Show Success View
                enquiryForm.classList.add('hide');
                if (successMsgBox) {
                    const leadRefEl = document.getElementById('lead-ref-code');
                    if (leadRefEl) leadRefEl.textContent = leadRefCode;
                    successMsgBox.classList.remove('hide');
                }
            }
        });
    }

    function showError(errorId, inputEl) {
        const parent = inputEl.closest('.form-group');
        if (parent) parent.classList.add('has-error');
    }

    if (resetFormBtn && enquiryForm && successMsgBox) {
        resetFormBtn.addEventListener('click', () => {
            enquiryForm.reset();
            enquiryForm.classList.remove('hide');
            successMsgBox.classList.add('hide');
        });
    }

    // ----------------------------------------------------------------------
    // 6. CAMPAIGN ANALYTICS HUD MODAL & CONTROLS
    // ----------------------------------------------------------------------
    const toggleAnalyticsBtn = document.getElementById('toggle-analytics-btn');
    const analyticsModal = document.getElementById('analytics-modal');
    const closeAnalyticsModalBtn = document.getElementById('close-analytics-modal');
    const closeAnalyticsBtn = document.getElementById('close-analytics-btn');
    const clearLeadsBtn = document.getElementById('clear-leads-btn');

    if (toggleAnalyticsBtn && analyticsModal) {
        toggleAnalyticsBtn.addEventListener('click', () => {
            updateAnalyticsUI();
            analyticsModal.classList.remove('hide');
            trackEvent('open_analytics_hud');
        });
    }

    const closeAnalyticsModal = () => analyticsModal && analyticsModal.classList.add('hide');
    if (closeAnalyticsModalBtn) closeAnalyticsModalBtn.addEventListener('click', closeAnalyticsModal);
    if (closeAnalyticsBtn) closeAnalyticsBtn.addEventListener('click', closeAnalyticsModal);

    if (clearLeadsBtn) {
        clearLeadsBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear stored leads for this test session?')) {
                localStorage.removeItem('college_admissions_leads');
                updateAnalyticsUI();
                showToast('LocalStorage leads cleared!');
            }
        });
    }

    // Initial analytics update
    updateAnalyticsUI();
});
