/* ============================================
   CV FORGE — app.js
   All interactivity: form logic, live preview,
   photo handling, dynamic blocks, PDF download
   ============================================ */

// ---- STATE ----
let photoDataURL = null;
let experiences = [];
let educations = [];
let certs = [];

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  addExperience();
  addEducation();
  setupPhotoUpload();
  updatePreview();
});

// ============================================
// PHOTO UPLOAD
// ============================================
function setupPhotoUpload() {
  const input = document.getElementById('photoInput');
  const wrapper = document.getElementById('photoPreviewWrapper');

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      photoDataURL = ev.target.result;
      // Show in form
      const prev = document.getElementById('photoPreview');
      prev.src = photoDataURL;
      prev.classList.remove('hidden');
      document.getElementById('photoPlaceholder').classList.add('hidden');
      // Update CV preview
      updatePhotoOnCV();
    };
    reader.readAsDataURL(file);
  });

  // Click on preview wrapper also triggers upload
  wrapper.addEventListener('click', () => input.click());
}

function updatePhotoOnCV() {
  const cvImg = document.getElementById('cvPhotoImg');
  const cvEmpty = document.getElementById('cvPhotoEmpty');
  if (photoDataURL) {
    cvImg.src = photoDataURL;
    cvImg.classList.remove('hidden');
    cvEmpty.classList.add('hidden');
  } else {
    cvImg.classList.add('hidden');
    cvEmpty.classList.remove('hidden');
  }
}

// ============================================
// DYNAMIC BLOCKS — EXPERIENCE
// ============================================
function addExperience() {
  const id = Date.now();
  experiences.push(id);
  const container = document.getElementById('experienceList');
  const block = document.createElement('div');
  block.className = 'dynamic-block';
  block.id = `exp_${id}`;
  block.innerHTML = `
    <button class="btn-remove" onclick="removeExperience(${id})">✕ Remove</button>
    <div class="form-grid">
      <div class="form-group">
        <label>Job Title</label>
        <input type="text" id="expTitle_${id}" placeholder="e.g. Frontend Developer" oninput="updatePreview()"/>
      </div>
      <div class="form-group">
        <label>Company / Organisation</label>
        <input type="text" id="expCompany_${id}" placeholder="e.g. Google Inc." oninput="updatePreview()"/>
      </div>
      <div class="form-group">
        <label>Start Date</label>
        <input type="text" id="expStart_${id}" placeholder="Jan 2022" oninput="updatePreview()"/>
      </div>
      <div class="form-group">
        <label>End Date</label>
        <input type="text" id="expEnd_${id}" placeholder="Dec 2023 or Present" oninput="updatePreview()"/>
      </div>
      <div class="form-group full">
        <label>Key Responsibilities / Achievements</label>
        <textarea id="expDesc_${id}" rows="3" placeholder="Describe your role and key achievements. Use bullet points by pressing Enter for each point..." oninput="updatePreview()"></textarea>
      </div>
    </div>
  `;
  container.appendChild(block);
}

function removeExperience(id) {
  experiences = experiences.filter(e => e !== id);
  document.getElementById(`exp_${id}`)?.remove();
  updatePreview();
}

// ============================================
// DYNAMIC BLOCKS — EDUCATION
// ============================================
function addEducation() {
  const id = Date.now();
  educations.push(id);
  const container = document.getElementById('educationList');
  const block = document.createElement('div');
  block.className = 'dynamic-block';
  block.id = `edu_${id}`;
  block.innerHTML = `
    <button class="btn-remove" onclick="removeEducation(${id})">✕ Remove</button>
    <div class="form-grid">
      <div class="form-group">
        <label>Degree / Qualification</label>
        <input type="text" id="eduDegree_${id}" placeholder="e.g. B.Sc. Computer Science" oninput="updatePreview()"/>
      </div>
      <div class="form-group">
        <label>Institution</label>
        <input type="text" id="eduSchool_${id}" placeholder="e.g. University of Lagos" oninput="updatePreview()"/>
      </div>
      <div class="form-group">
        <label>Start Year</label>
        <input type="text" id="eduStart_${id}" placeholder="2018" oninput="updatePreview()"/>
      </div>
      <div class="form-group">
        <label>End Year</label>
        <input type="text" id="eduEnd_${id}" placeholder="2022" oninput="updatePreview()"/>
      </div>
      <div class="form-group full">
        <label>Grade / Achievements (optional)</label>
        <input type="text" id="eduGrade_${id}" placeholder="e.g. Second Class Upper (2:1), GPA 3.8/4.0" oninput="updatePreview()"/>
      </div>
    </div>
  `;
  container.appendChild(block);
}

function removeEducation(id) {
  educations = educations.filter(e => e !== id);
  document.getElementById(`edu_${id}`)?.remove();
  updatePreview();
}

// ============================================
// DYNAMIC BLOCKS — CERTIFICATIONS
// ============================================
function addCert() {
  const id = Date.now();
  certs.push(id);
  const container = document.getElementById('certList');
  const block = document.createElement('div');
  block.className = 'dynamic-block';
  block.id = `cert_${id}`;
  block.innerHTML = `
    <button class="btn-remove" onclick="removeCert(${id})">✕ Remove</button>
    <div class="form-grid">
      <div class="form-group">
        <label>Certification Name</label>
        <input type="text" id="certName_${id}" placeholder="e.g. AWS Certified Developer" oninput="updatePreview()"/>
      </div>
      <div class="form-group">
        <label>Issuing Body</label>
        <input type="text" id="certIssuer_${id}" placeholder="e.g. Amazon Web Services" oninput="updatePreview()"/>
      </div>
      <div class="form-group">
        <label>Year</label>
        <input type="text" id="certYear_${id}" placeholder="2023" oninput="updatePreview()"/>
      </div>
    </div>
  `;
  container.appendChild(block);
}

function removeCert(id) {
  certs = certs.filter(c => c !== id);
  document.getElementById(`cert_${id}`)?.remove();
  updatePreview();
}

// ============================================
// LIVE PREVIEW UPDATE
// ============================================
function updatePreview() {
  // Personal info
  const name = val('fullName') || 'Your Full Name';
  const role = val('jobTitle') || 'Job Title / Role';
  const email = val('email');
  const phone = val('phone');
  const location = val('location');
  const linkedin = val('linkedin');

  setText('cvName', name);
  setText('cvRole', role);

  // Contacts
  const cvContacts = document.getElementById('cvContacts');
  cvContacts.innerHTML = '';
  if (email) cvContacts.innerHTML += `<span>📧 ${esc(email)}</span>`;
  if (phone) cvContacts.innerHTML += `<span>📞 ${esc(phone)}</span>`;
  if (location) cvContacts.innerHTML += `<span>📍 ${esc(location)}</span>`;
  if (linkedin) cvContacts.innerHTML += `<span>🔗 ${esc(linkedin)}</span>`;
  if (!email && !phone && !location && !linkedin) {
    cvContacts.innerHTML = `<span style="color:#ccc">📧 Email &nbsp; 📞 Phone &nbsp; 📍 Location</span>`;
  }

  // Summary
  const summaryText = val('summary');
  const cvSummary = document.getElementById('cvSummary');
  if (summaryText) {
    cvSummary.textContent = summaryText;
    cvSummary.style.color = '';
  } else {
    cvSummary.textContent = 'Your professional summary will appear here...';
    cvSummary.style.color = '#ccc';
  }

  // Experience
  const expList = document.getElementById('cvExperienceList');
  const expEntries = experiences.map(id => {
    const title = val(`expTitle_${id}`);
    const company = val(`expCompany_${id}`);
    const start = val(`expStart_${id}`);
    const end = val(`expEnd_${id}`);
    const desc = val(`expDesc_${id}`);
    if (!title && !company) return null;
    return { title, company, start, end, desc };
  }).filter(Boolean);

  if (expEntries.length === 0) {
    expList.innerHTML = `<p class="cv-placeholder">Add your work experience using the form.</p>`;
  } else {
    expList.innerHTML = expEntries.map(e => `
      <div class="cv-entry">
        <div class="cv-entry-header">
          <span class="cv-entry-title">${esc(e.title || 'Position')}</span>
          ${(e.start || e.end) ? `<span class="cv-entry-date">${esc(e.start)}${e.end ? ' – ' + esc(e.end) : ''}</span>` : ''}
        </div>
        ${e.company ? `<div class="cv-entry-subtitle">${esc(e.company)}</div>` : ''}
        ${e.desc ? `<div class="cv-entry-desc">${esc(e.desc)}</div>` : ''}
      </div>
    `).join('');
  }

  // Education
  const eduList = document.getElementById('cvEducationList');
  const eduEntries = educations.map(id => {
    const degree = val(`eduDegree_${id}`);
    const school = val(`eduSchool_${id}`);
    const start = val(`eduStart_${id}`);
    const end = val(`eduEnd_${id}`);
    const grade = val(`eduGrade_${id}`);
    if (!degree && !school) return null;
    return { degree, school, start, end, grade };
  }).filter(Boolean);

  if (eduEntries.length === 0) {
    eduList.innerHTML = `<p class="cv-placeholder">Add your education using the form.</p>`;
  } else {
    eduList.innerHTML = eduEntries.map(e => `
      <div class="cv-entry">
        <div class="cv-entry-header">
          <span class="cv-entry-title">${esc(e.degree || 'Degree')}</span>
          ${(e.start || e.end) ? `<span class="cv-entry-date">${esc(e.start)}${e.end ? ' – ' + esc(e.end) : ''}</span>` : ''}
        </div>
        ${e.school ? `<div class="cv-entry-subtitle">${esc(e.school)}</div>` : ''}
        ${e.grade ? `<div class="cv-entry-desc">${esc(e.grade)}</div>` : ''}
      </div>
    `).join('');
  }

  // Skills
  const skillsRaw = val('skills');
  const cvSkillsList = document.getElementById('cvSkillsList');
  if (skillsRaw) {
    const tags = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);
    cvSkillsList.innerHTML = tags.map(t => `<span class="cv-skill-tag">${esc(t)}</span>`).join('');
  } else {
    cvSkillsList.innerHTML = `<span class="cv-skill-tag" style="color:#ccc;border-color:#e0dbd2">Your skills appear here</span>`;
  }

  // Certifications
  const certSection = document.getElementById('cvCertSection');
  const certList = document.getElementById('cvCertList');
  const certEntries = certs.map(id => {
    const name = val(`certName_${id}`);
    const issuer = val(`certIssuer_${id}`);
    const year = val(`certYear_${id}`);
    if (!name) return null;
    return { name, issuer, year };
  }).filter(Boolean);

  if (certEntries.length > 0) {
    certSection.classList.remove('hidden');
    certList.innerHTML = certEntries.map(c => `
      <div class="cv-cert-entry">
        <span class="cv-cert-name">${esc(c.name)}</span>
        ${c.issuer ? ` — ${esc(c.issuer)}` : ''}
        ${c.year ? ` <span style="color:var(--cv-gold)">(${esc(c.year)})</span>` : ''}
      </div>
    `).join('');
  } else {
    certSection.classList.add('hidden');
  }

  // Languages
  const langSection = document.getElementById('cvLangSection');
  const langText = val('languages');
  if (langText) {
    langSection.classList.remove('hidden');
    document.getElementById('cvLanguages').textContent = langText;
  } else {
    langSection.classList.add('hidden');
  }

  // References
  const refSection = document.getElementById('cvRefSection');
  const refText = val('references');
  if (refText) {
    refSection.classList.remove('hidden');
    document.getElementById('cvReferences').textContent = refText;
  } else {
    refSection.classList.add('hidden');
  }

  // Photo
  updatePhotoOnCV();
}

// ============================================
// PDF DOWNLOAD
// ============================================
function downloadCV() {
  window.print();
}

// ============================================
// MOBILE PANEL TOGGLE
// ============================================
function showPanel(panel) {
  const formPanel = document.getElementById('formPanel');
  const previewPanel = document.getElementById('previewPanel');
  const btnForm = document.getElementById('btnForm');
  const btnPreview = document.getElementById('btnPreview');

  if (panel === 'form') {
    formPanel.classList.remove('hidden-mobile');
    previewPanel.classList.add('hidden-mobile');
    btnForm.classList.add('active');
    btnPreview.classList.remove('active');
  } else {
    previewPanel.classList.remove('hidden-mobile');
    formPanel.classList.add('hidden-mobile');
    btnPreview.classList.add('active');
    btnForm.classList.remove('active');
  }
}

// ============================================
// HELPERS
// ============================================
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function esc(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
