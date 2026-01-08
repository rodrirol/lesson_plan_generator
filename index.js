// Global variables
let chunkCount = 1;

// Add a new lesson chunk
function addLessonChunk() {
    chunkCount++;
    const newChunk = document.createElement('div');
    newChunk.className = 'chunk-section';
    newChunk.id = `chunk-${chunkCount}`;

    newChunk.innerHTML = `
                <div class="chunk-header">
                    <h5>Lesson Chunk ${chunkCount}</h5>
                    <span class="remove-chunk" onclick="removeChunk(${chunkCount})"><i class="fas fa-times"></i> Remove</span>
                </div>
                <div class="mb-3">
                    <label for="chunk${chunkCount}Activity" class="form-label required">What are they doing? What tools/resources are needed?</label>
                    <textarea class="form-control chunk-activity" id="chunk${chunkCount}Activity" rows="2" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="chunk${chunkCount}Assessment" class="form-label required">How will I know they got it?</label>
                    <textarea class="form-control chunk-assessment" id="chunk${chunkCount}Assessment" rows="2" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="chunk${chunkCount}Progress" class="form-label required">How will I monitor student progress?</label>
                    <textarea class="form-control chunk-progress" id="chunk${chunkCount}Progress" rows="2" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="chunk${chunkCount}PlanB" class="form-label">Plan B: What will I do if tech fails or the lesson is bombing?</label>
                    <textarea class="form-control chunk-planb" id="chunk${chunkCount}PlanB" rows="2"></textarea>
                </div>
                <div class="mb-3">
                    <label for="chunk${chunkCount}Teaming" class="form-label">Teaming</label>
                    <textarea class="form-control chunk-teaming" id="chunk${chunkCount}Teaming" rows="2"></textarea>
                </div>
            `;

    document.getElementById('lessonChunks').appendChild(newChunk);
}

// Remove a lesson chunk
function removeChunk(chunkId) {
    if (chunkCount > 1) {
        const chunkToRemove = document.getElementById(`chunk-${chunkId}`);
        if (chunkToRemove) {
            chunkToRemove.remove();
            renumberChunks();
        }
    } else {
        alert("You must have at least one lesson chunk.");
    }
}

// Renumber chunks after removal
function renumberChunks() {
    const chunks = document.querySelectorAll('.chunk-section');
    chunkCount = chunks.length;

    chunks.forEach((chunk, index) => {
        const chunkNumber = index + 1;
        chunk.id = `chunk-${chunkNumber}`;
        chunk.querySelector('h5').textContent = `Lesson Chunk ${chunkNumber}`;
        chunk.querySelector('.remove-chunk').setAttribute('onclick', `removeChunk(${chunkNumber})`);

        const textareas = chunk.querySelectorAll('textarea');
        const types = ['activity', 'assessment', 'progress', 'planb', 'teaming'];

        textareas.forEach((textarea, i) => {
            textarea.id = `chunk${chunkNumber}${types[i].charAt(0).toUpperCase() + types[i].slice(1)}`;
        });
    });
}

function previewLessonPlan() {
    if (!validateForm()) return;
    const formData = getFormData();
    const previewHTML = generatePreviewHTML(formData);
    document.getElementById('lessonPlanPreview').innerHTML = previewHTML;
    document.getElementById('previewArea').style.display = 'block';
    document.getElementById('previewArea').scrollIntoView({ behavior: 'smooth' });
}

function closePreview() {
    document.getElementById('previewArea').style.display = 'none';
}

// Escape HTML entities for PDF safety
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function getFormData() {
    const instructor = document.getElementById('instructor').value;
    const date = document.getElementById('date').value;
    const learningGoals = document.getElementById('learningGoals').value;
    const challengeLevel = document.querySelector('input[name="challengeLevel"]:checked').value;
    const introduceContent = document.getElementById('introduceContent').value;
    const deepenContent = document.getElementById('deepenContent').value;
    const complexTask = document.getElementById('complexTask').value;
    const vocabTerms = document.getElementById('vocabTerms').value.split('\n').filter(term => term.trim() !== '');
    const vocabStrategies = Array.from(document.querySelectorAll('input[name="vocabStrategy"]:checked')).map(cb => cb.value);
    const prepare = document.getElementById('prepare').value;
    const activate = document.getElementById('activate').value;
    const navigate = document.getElementById('navigate').value;
    const demonstrate = document.getElementById('demonstrate').value;
    const articulate = document.getElementById('articulate').value;

    const lessonChunks = [];
    for (let i = 1; i <= chunkCount; i++) {
        const activityElem = document.getElementById(`chunk${i}Activity`);
        if (activityElem) {
            lessonChunks.push({
                activity: activityElem.value,
                assessment: document.getElementById(`chunk${i}Assessment`).value,
                progress: document.getElementById(`chunk${i}Progress`).value,
                planB: document.getElementById(`chunk${i}PlanB`).value,
                teaming: document.getElementById(`chunk${i}Teaming`).value
            });
        }
    }

    const strugglersNeeds = document.getElementById('strugglersNeeds').value;
    const mostStudents = document.getElementById('mostStudents').value;
    const rockstarReady = document.getElementById('rockstarReady').value;
    const noviceLevel = document.getElementById('noviceLevel').value;
    const inPursuit = document.getElementById('inPursuit').value;
    const approaching = document.getElementById('approaching').value;
    const meeting = document.getElementById('meeting').value;
    const exceeding = document.getElementById('exceeding').value;
    const exceedingSkills = document.getElementById('exceedingSkills').value;
    const whatWentWell = document.getElementById('whatWentWell').value;
    const whatNotAwesome = document.getElementById('whatNotAwesome').value;
    const howImprove = document.getElementById('howImprove').value;
    const actionsImprove = document.getElementById('actionsImprove').value;

    return {
        instructor, date, learningGoals, challengeLevel, introduceContent, deepenContent,
        complexTask, vocabTerms, vocabStrategies, prepare, activate, navigate, demonstrate,
        articulate, lessonChunks, strugglersNeeds, mostStudents, rockstarReady, noviceLevel,
        inPursuit, approaching, meeting, exceeding, exceedingSkills, whatWentWell,
        whatNotAwesome, howImprove, actionsImprove
    };
}

function generatePreviewHTML(data) {
    const dateObj = new Date(data.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const vocabTermsList = data.vocabTerms.map(term => `<li>${term}</li>`).join('');
    const vocabStrategiesList = data.vocabStrategies.map(strategy => `<li>${strategy}</li>`).join('');

    let lessonChunksHTML = '';
    data.lessonChunks.forEach((chunk, index) => {
        lessonChunksHTML += `
            <div style="border: 2px solid #003366; border-radius: 8px; background: #f0f8ff; padding: 16px; margin-bottom: 18px;">
                <h5 style="color: #003366; margin-top: 0; margin-bottom: 10px;">Lesson Chunk ${index + 1}</h5>
                <p><strong>Activity/Tools:</strong> ${chunk.activity}</p>
                <p><strong>Assessment:</strong> ${chunk.assessment}</p>
                <p><strong>Progress Monitoring:</strong> ${chunk.progress}</p>
                <p><strong>Plan B:</strong> ${chunk.planB || 'N/A'}</p>
                <p><strong>Teaming:</strong> ${chunk.teaming || 'N/A'}</p>
            </div>
        `;
    });

    return `<h2 style="text-align: center;">CCPS Post-Secondary</h2>
            <h3 style="text-align: center;">Lesson Plan</h3>
            <p style="text-align: center;"><strong>Instructor:</strong> ${data.instructor} | <strong>Date:</strong> ${formattedDate}</p>
            <hr>
            <h4>What am I teaching today/this week?</h4>
            <p>${data.learningGoals}</p>
            <table class="preview-table" width="100%">
                <tr><th colspan="3" style="background:#eaf6ff;font-weight:bold;">How Challenging is this for my students?</th></tr>
                <tr>
                    <td ${data.challengeLevel === 'Basic' ? 'style="background-color: #d4edda;"' : ''}>Basic</td>
                    <td ${data.challengeLevel === 'Moderate' ? 'style="background-color: #d4edda;"' : ''}>Moderate</td>
                    <td ${data.challengeLevel === 'Advanced' ? 'style="background-color: #d4edda;"' : ''}>Advanced</td>
                </tr>
            </table>
            <h4>What is the focus of today's lesson?</h4>
            <table class="preview-table" width="100%">
                <tr>
                    <th style="background:#eaf6ff;font-weight:bold;">Introduce New Content</th>
                    <th style="background:#eaf6ff;font-weight:bold;">Deepen New Content</th>
                    <th style="background:#eaf6ff;font-weight:bold;">Cognitively Complex Task</th>
                </tr>
                <tr>
                    <td>${data.introduceContent}</td>
                    <td>${data.deepenContent}</td>
                    <td>${data.complexTask}</td>
                </tr>
            </table>
            <h4>Industry Specific Vocabulary</h4>
            <div class="row">
                <div class="col-md-6">
                    <h5>What terms will my students need to learn?</h5>
                    <ul>${vocabTermsList}</ul>
                </div>
                <div class="col-md-6">
                    <h5>How will my students interact with these terms?</h5>
                    <ul>${vocabStrategiesList}</ul>
                </div>
            </div>
            <h4>P.A.N.D.A. Module Planning Framework</h4>
            <table class="preview-table" width="100%">
                <tr><th style="background:#eaf6ff;font-weight:bold;">P.A.N.D.A. Component</th><th style="background:#eaf6ff;font-weight:bold;">Instructor Planning Notes</th></tr>
                <tr><td><strong>Prepare</strong></td><td>${data.prepare}</td></tr>
                <tr><td><strong>Activate</strong></td><td>${data.activate}</td></tr>
                <tr><td><strong>Navigate</strong></td><td>${data.navigate}</td></tr>
                <tr><td><strong>Demonstrate</strong></td><td>${data.demonstrate}</td></tr>
                <tr><td><strong>Articulate</strong></td><td>${data.articulate}</td></tr>
            </table>
            <h4>Lesson Chunks</h4>
            ${lessonChunksHTML}
            <h4>Differentiated Instruction</h4>
            <table class="preview-table" width="100%">
                <tr>
                    <th style="background:#eaf6ff;font-weight:bold;">Strugglers</th>
                    <th style="background:#eaf6ff;font-weight:bold;">Most Students</th>
                    <th style="background:#eaf6ff;font-weight:bold;">Rock Stars</th>
                </tr>
                <tr>
                    <td>${data.strugglersNeeds || 'N/A'}</td>
                    <td>${data.mostStudents || '[Leave blank]'}</td>
                    <td>${data.rockstarReady || 'N/A'}</td>
                </tr>
            </table>
            <h4>Performance Scale -- Specific to the Learning Target(s)</h4>
            <table class="preview-table student-levels" width="100%">
                <tr><th style="background:#eaf6ff;font-weight:bold;">Novice Level</th><td><strong>Minimal awareness</strong><br>${data.noviceLevel || 'N/A'}</td></tr>
                <tr><th style="background:#eaf6ff;font-weight:bold;">In Pursuit</th><td><strong>Basic awareness</strong><br>${data.inPursuit || 'N/A'}</td></tr>
                <tr><th style="background:#eaf6ff;font-weight:bold;">Approaching</th><td><strong>Familiar with vocabulary</strong><br>${data.approaching || 'N/A'}</td></tr>
                <tr><th style="background:#eaf6ff;font-weight:bold;">Meeting Target</th><td><strong>Successfully meets target</strong><br>${data.meeting || 'N/A'}</td></tr>
                <tr><th style="background:#eaf6ff;font-weight:bold;">Exceeding</th><td><strong>Applies fluidly</strong><br>${data.exceeding || 'N/A'}${data.exceedingSkills ? `<br><br><strong>Additional skills:</strong> ${data.exceedingSkills}` : ''}</td></tr>
            </table>
            ${data.whatWentWell || data.whatNotAwesome || data.howImprove || data.actionsImprove ? `
            <h4>Reflection</h4>
            <table class="preview-table">
                <tr><th style="background:#eaf6ff;font-weight:bold;">What went well?</th><td>${data.whatWentWell || 'N/A'}</td></tr>
                <tr><th style="background:#eaf6ff;font-weight:bold;">What was less awesome?</th><td>${data.whatNotAwesome || 'N/A'}</td></tr>
                <tr><th style="background:#eaf6ff;font-weight:bold;">How improve?</th><td>${data.howImprove || 'N/A'}</td></tr>
                <tr><th style="background:#eaf6ff;font-weight:bold;">Actions to improve?</th><td>${data.actionsImprove || 'N/A'}</td></tr>
            </table>` : ''}
            <hr>
            <p style="text-align: center; font-size: 0.9em; color: #666;">Generated on ${new Date().toLocaleDateString()}</p>`;
}

async function generateWordDocument() {
    if (!validateForm()) return;

    const generateBtn = document.querySelector('button[onclick="generateWordDocument()"]');
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Word Document...';
    generateBtn.disabled = true;

    try {
        const data = getFormData();
        
        const dateObj = new Date(data.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Create HTML content for Word
        const htmlContent = createWordHTML(data, formattedDate);
        
        // Convert HTML to .docx format
        const docContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='UTF-8'>
                <style>
                    body { 
                        font-family: Calibri, Arial, sans-serif; 
                        font-size: 11pt; 
                        margin: 0.5in 0.5in 0.5in 0.5in;
                        width: 7.5in;
                    }
                    h2 { text-align: center; font-size: 18pt; margin: 0 0 8pt 0; }
                    h3 { text-align: center; font-size: 14pt; margin: 0 0 8pt 0; }
                    table { width: 100%; border-collapse: collapse; margin: 3pt 0 10pt 0; table-layout: fixed; }
                    th, td { border: 1pt solid #999; padding: 6pt; text-align: left; vertical-align: top; word-wrap: break-word; overflow-wrap: break-word; }
                    th { background-color: #e8e8e8; font-weight: bold; }
                    .highlight { background-color: #d4edda; }
                    hr { margin: 8pt 0; }
                    p { margin: 6pt 0; word-wrap: break-word; overflow-wrap: break-word; }
                    ul { margin: 0; padding-left: 20pt; }
                    li { margin: 4pt 0; }
                </style>
            </head>
            <body>
            ${htmlContent}
            </body>
            </html>
        `;
        
        // Create blob and download
        const blob = new Blob([docContent], { 
            type: 'application/msword'
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `LessonPlan_${data.instructor.replace(/\s+/g, '_')}_${data.date}.doc`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert(`Lesson plan Word document generated successfully: ${fileName}`);

    } catch (error) {
        console.error('Word Document Error:', error);
        alert('Error generating Word document: ' + error.message);
    } finally {
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
    }
}

function createWordHTML(data, formattedDate) {
    const vocabTermsList = data.vocabTerms.map(term => `<li>${term}</li>`).join('');
    const vocabStrategiesList = data.vocabStrategies.map(strategy => `<li>${strategy}</li>`).join('');

    let lessonChunksHTML = `<table style="width:100%; border-collapse:collapse; margin-bottom:15px; table-layout:fixed;">
        <tr>
            <th style="background-color:#dbefff; width:6%">#</th>
            <th style="background-color:#dbefff;">Activity/Tools</th>
            <th style="background-color:#dbefff;">Assessment</th>
            <th style="background-color:#dbefff;">Progress Monitoring</th>
            <th style="background-color:#dbefff;">Plan B</th>
            <th style="background-color:#dbefff;">Teaming</th>
        </tr>`;
    data.lessonChunks.forEach((chunk, index) => {
        lessonChunksHTML += `
            <tr>
                <td style="text-align:center;">${index + 1}</td>
                <td>${chunk.activity}</td>
                <td>${chunk.assessment}</td>
                <td>${chunk.progress}</td>
                <td>${chunk.planB || 'N/A'}</td>
                <td>${chunk.teaming || 'N/A'}</td>
            </tr>
        `;
    });
    lessonChunksHTML += '</table>';

    return `
        <h2>CCPS Post-Secondary</h2>
        <h3>Lesson Plan</h3>
        <p style="text-align: center;"><strong>Instructor:</strong> ${data.instructor} | <strong>Date:</strong> ${formattedDate}</p>
        
        <hr>
        
        <h4>What am I teaching today/this week?</h4>
        <p>${data.learningGoals}</p>
        
        <h4>How Challenging is this for my students?</h4>
        <table>
            <tr>
                <td style="text-align: center; background-color:${data.challengeLevel === 'Basic' ? '#d4edda' : 'transparent'}; font-weight:${data.challengeLevel === 'Basic' ? 'bold' : 'normal'};">Basic</td>
                <td style="text-align: center; background-color:${data.challengeLevel === 'Moderate' ? '#d4edda' : 'transparent'}; font-weight:${data.challengeLevel === 'Moderate' ? 'bold' : 'normal'};">Moderate</td>
                <td style="text-align: center; background-color:${data.challengeLevel === 'Advanced' ? '#d4edda' : 'transparent'}; font-weight:${data.challengeLevel === 'Advanced' ? 'bold' : 'normal'};">Advanced</td>
            </tr>
        </table>
        
        <h4>What is the focus of today's lesson?</h4>
        <table>
            <tr>
                <th style="background-color:#dbefff;">Introduce New Content</th>
                <th style="background-color:#dbefff;">Deepen New Content</th>
                <th style="background-color:#dbefff;">Cognitively Complex Task</th>
            </tr>
            <tr>
                <td>${data.introduceContent}</td>
                <td>${data.deepenContent}</td>
                <td>${data.complexTask}</td>
            </tr>
        </table>
        
        <h4>Industry Specific Vocabulary</h4>
        <table>
            <tr>
                <th style="background-color:#dbefff;">Terms to Learn</th>
                <th style="background-color:#dbefff;">Interaction Strategies</th>
            </tr>
            <tr>
                <td><ul>${vocabTermsList}</ul></td>
                <td><ul>${vocabStrategiesList}</ul></td>
            </tr>
        </table>
        
        <h4>P.A.N.D.A. Module Planning Framework</h4>
        <table>
            <tr>
                <th style="width: 25%; background-color:#dbefff;">Component</th>
                <th style="background-color:#dbefff;">Notes</th>
            </tr>
            <tr>
                <td><strong>Prepare</strong></td>
                <td>${data.prepare}</td>
            </tr>
            <tr>
                <td><strong>Activate</strong></td>
                <td>${data.activate}</td>
            </tr>
            <tr>
                <td><strong>Navigate</strong></td>
                <td>${data.navigate}</td>
            </tr>
            <tr>
                <td><strong>Demonstrate</strong></td>
                <td>${data.demonstrate}</td>
            </tr>
            <tr>
                <td><strong>Articulate</strong></td>
                <td>${data.articulate}</td>
            </tr>
        </table>
        
        <h4>Lesson Chunks</h4>
        ${lessonChunksHTML}
        
        <h4>Differentiated Instruction</h4>
        <table>
            <tr>
                <th style="background-color:#dbefff;">Strugglers</th>
                <th style="background-color:#dbefff;">Most Students</th>
                <th style="background-color:#dbefff;">Rock Stars</th>
            </tr>
            <tr>
                <td>${data.strugglersNeeds || 'N/A'}</td>
                <td>${data.mostStudents || 'N/A'}</td>
                <td>${data.rockstarReady || 'N/A'}</td>
            </tr>
        </table>
        
        <h4>Performance Scale -- Specific to the Learning Target(s)</h4>
        <table style="width:100%; border-collapse:collapse; margin-bottom:15px; table-layout:fixed;">
            <tr>
                <th style="width: 25%; background-color:#dbefff;">Level</th>
                <th style="background-color:#dbefff;">Description</th>
            </tr>
            <tr>
                <td><strong>Novice Level</strong></td>
                <td><span style="font-weight:bold; color:#333;">Minimal awareness</span><br><span style="font-style:italic; color:#888; font-size:10pt;">${data.noviceLevel || 'N/A'}</span></td>
            </tr>
            <tr>
                <td><strong>In Pursuit</strong></td>
                <td><span style="font-weight:bold; color:#333;">Basic awareness</span><br><span style="font-style:italic; color:#888; font-size:10pt;">${data.inPursuit || 'N/A'}</span></td>
            </tr>
            <tr>
                <td><strong>Approaching</strong></td>
                <td><span style="font-weight:bold; color:#333;">Familiar with vocabulary</span><br><span style="font-style:italic; color:#888; font-size:10pt;">${data.approaching || 'N/A'}</span></td>
            </tr>
            <tr>
                <td><strong>Meeting Target</strong></td>
                <td><span style="font-weight:bold; color:#333;">Successfully meets target</span><br><span style="font-style:italic; color:#888; font-size:10pt;">${data.meeting || 'N/A'}</span></td>
            </tr>
            <tr>
                <td><strong>Exceeding</strong></td>
                <td><span style="font-weight:bold; color:#333;">Applies fluidly</span><br><span style="font-style:italic; color:#888; font-size:10pt;">${data.exceeding || 'N/A'}${data.exceedingSkills ? `<br/><strong>Additional skills:</strong> ${data.exceedingSkills}` : ''}</span></td>
            </tr>
        </table>
        
        ${data.whatWentWell || data.whatNotAwesome || data.howImprove || data.actionsImprove ? `
        <h4>Reflection</h4>
        <table>
            <tr>
                <th style="width: 30%; background-color:#dbefff;">Question</th>
                <th style="background-color:#dbefff;">Response</th>
            </tr>
            <tr>
                <td><strong>What went well?</strong></td>
                <td>${data.whatWentWell || 'N/A'}</td>
            </tr>
            <tr>
                <td><strong>What was less awesome?</strong></td>
                <td>${data.whatNotAwesome || 'N/A'}</td>
            </tr>
            <tr>
                <td><strong>How improve?</strong></td>
                <td>${data.howImprove || 'N/A'}</td>
            </tr>
            <tr>
                <td><strong>Actions to improve?</strong></td>
                <td>${data.actionsImprove || 'N/A'}</td>
            </tr>
        </table>` : ''}
        
        <hr>
        <p style="text-align: center; font-size: 9pt; color: #666;">Generated on ${new Date().toLocaleDateString()}</p>
    `;
}

function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;

    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            if (isValid) {
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                field.focus();
            }
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    }

    if (!isValid) {
        alert('Please fill in all required fields (marked with *).');
    }
    return isValid;
}

document.getElementById('date').valueAsDate = new Date();

document.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', function () {
        if (this.value.trim()) {
            this.classList.remove('is-invalid');
        }
    });
});