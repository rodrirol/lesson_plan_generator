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
            // Re-number remaining chunks
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

        // Update IDs of textareas
        const textareas = chunk.querySelectorAll('textarea');
        const types = ['activity', 'assessment', 'progress', 'planb', 'teaming'];

        textareas.forEach((textarea, i) => {
            textarea.id = `chunk${chunkNumber}${types[i].charAt(0).toUpperCase() + types[i].slice(1)}`;
        });
    });
}

// Preview the lesson plan
function previewLessonPlan() {
    // Validate form
    if (!validateForm()) {
        return;
    }

    // Get form values
    const formData = getFormData();

    // Generate preview HTML
    const previewHTML = generatePreviewHTML(formData);

    // Display preview
    document.getElementById('lessonPlanPreview').innerHTML = previewHTML;
    document.getElementById('previewArea').style.display = 'block';

    // Scroll to preview
    document.getElementById('previewArea').scrollIntoView({ behavior: 'smooth' });
}

// Close the preview
function closePreview() {
    document.getElementById('previewArea').style.display = 'none';
}

// Get all form data
function getFormData() {
    // Get basic information
    const instructor = document.getElementById('instructor').value;
    const date = document.getElementById('date').value;
    const learningGoals = document.getElementById('learningGoals').value;

    // Get challenge level
    const challengeLevel = document.querySelector('input[name="challengeLevel"]:checked').value;

    // Get lesson focus
    const introduceContent = document.getElementById('introduceContent').value;
    const deepenContent = document.getElementById('deepenContent').value;
    const complexTask = document.getElementById('complexTask').value;

    // Get vocabulary data
    const vocabTerms = document.getElementById('vocabTerms').value.split('\n').filter(term => term.trim() !== '');
    const vocabStrategies = Array.from(document.querySelectorAll('input[name="vocabStrategy"]:checked')).map(cb => cb.value);

    // Get PANDA data
    const prepare = document.getElementById('prepare').value;
    const activate = document.getElementById('activate').value;
    const navigate = document.getElementById('navigate').value;
    const demonstrate = document.getElementById('demonstrate').value;
    const articulate = document.getElementById('articulate').value;

    // Get lesson chunks data
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

    // Get differentiated instruction
    const strugglersNeeds = document.getElementById('strugglersNeeds').value;
    const mostStudents = document.getElementById('mostStudents').value;
    const rockstarReady = document.getElementById('rockstarReady').value;

    // Get performance scale data
    const noviceLevel = document.getElementById('noviceLevel').value;
    const inPursuit = document.getElementById('inPursuit').value;
    const approaching = document.getElementById('approaching').value;
    const meeting = document.getElementById('meeting').value;
    const exceeding = document.getElementById('exceeding').value;
    const exceedingSkills = document.getElementById('exceedingSkills').value;

    // Get reflection data
    const whatWentWell = document.getElementById('whatWentWell').value;
    const whatNotAwesome = document.getElementById('whatNotAwesome').value;
    const howImprove = document.getElementById('howImprove').value;
    const actionsImprove = document.getElementById('actionsImprove').value;

    return {
        instructor,
        date,
        learningGoals,
        challengeLevel,
        introduceContent,
        deepenContent,
        complexTask,
        vocabTerms,
        vocabStrategies,
        prepare,
        activate,
        navigate,
        demonstrate,
        articulate,
        lessonChunks,
        strugglersNeeds,
        mostStudents,
        rockstarReady,
        noviceLevel,
        inPursuit,
        approaching,
        meeting,
        exceeding,
        exceedingSkills,
        whatWentWell,
        whatNotAwesome,
        howImprove,
        actionsImprove
    };
}

// Generate preview HTML
function generatePreviewHTML(data) {
    // Format date
    const dateObj = new Date(data.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Generate vocabulary terms list
    const vocabTermsList = data.vocabTerms.map(term => `<li>${term}</li>`).join('');

    // Generate vocabulary strategies list
    const vocabStrategiesList = data.vocabStrategies.map(strategy => `<li>${strategy}</li>`).join('');

    // Generate lesson chunks HTML with enhanced styling
    let lessonChunksHTML = '';
    data.lessonChunks.forEach((chunk, index) => {
        lessonChunksHTML += `
            <div style="border: 2px solid #003366; border-radius: 8px; background: #f0f8ff; padding: 16px; margin-bottom: 18px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
                <h5 style="color: #003366; margin-top: 0; margin-bottom: 10px; font-size: 1.1em; letter-spacing: 1px;">Lesson Chunk ${index + 1}</h5>
                <p style="margin: 4px 0;"><strong>Activity/Tools:</strong> ${chunk.activity}</p>
                <p style="margin: 4px 0;"><strong>Assessment:</strong> ${chunk.assessment}</p>
                <p style="margin: 4px 0;"><strong>Progress Monitoring:</strong> ${chunk.progress}</p>
                <p style="margin: 4px 0;"><strong>Plan B:</strong> ${chunk.planB || 'N/A'}</p>
                <p style="margin: 4px 0;"><strong>Teaming:</strong> ${chunk.teaming || 'N/A'}</p>
            </div>
        `;
    });

    // Build the full preview HTML
    return `
                <h2 class="text-center">CCPS Post-Secondary</h2>
                <h3 class="text-center">Lesson Plan</h3>
                <p class="text-center"><strong>Instructor:</strong> ${data.instructor} | <strong>Date:</strong> ${formattedDate}</p>
                
                <hr>
                
                <h4>What am I teaching today/this week?</h4>
                <p>${data.learningGoals}</p>
                
                <table class="preview-table">
                    <tr>
                        <th colspan="3">How Challenging is this for my students?</th>
                    </tr>
                    <tr>
                        <td ${data.challengeLevel === 'Basic' ? 'style="background-color: #d4edda;"' : ''}>Basic</td>
                        <td ${data.challengeLevel === 'Moderate' ? 'style="background-color: #d4edda;"' : ''}>Moderate</td>
                        <td ${data.challengeLevel === 'Advanced' ? 'style="background-color: #d4edda;"' : ''}>Advanced</td>
                    </tr>
                </table>
                
                <h4>What is the focus of today's lesson?</h4>
                <table class="preview-table">
                    <tr>
                        <th>Introduce New Content</th>
                        <th>Deepen New Content</th>
                        <th>Cognitively Complex Task</th>
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
                <table class="preview-table">
                    <tr>
                        <th>P.A.N.D.A. Component</th>
                        <th>Instructor Planning Notes</th>
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
                <table class="preview-table">
                    <tr>
                        <th>Strugglers (students who have skill/knowledge gaps)</th>
                        <th>Most Students</th>
                        <th>Rock Stars (students who already possess the knowledge/skills)</th>
                    </tr>
                    <tr>
                        <td>${data.strugglersNeeds || 'N/A'}</td>
                        <td>${data.mostStudents || '[Leave this column blank.]'}</td>
                        <td>${data.rockstarReady || 'N/A'}</td>
                    </tr>
                </table>
                
                <h4>Performance Scale -- Specific to the Learning Target(s)</h4>
                <table class="preview-table student-levels">
                    <tr>
                        <th width="20%">Novice Level</th>
                        <td>
                            <strong>Minimal awareness of the learning target. May not yet understand the components or purpose of the learning target(s).</strong>
                            <br>${data.noviceLevel || 'Description not provided.'}
                        </td>
                    </tr>
                    <tr>
                        <th>In Pursuit of the Learning Target</th>
                        <td>
                            <strong>Demonstrates a basic awareness that the learning target(s) exist. Needs support to identify or explain the components and cannot yet connect them to the program of study.</strong>
                            <br>${data.inPursuit || 'Description not provided.'}
                        </td>
                    </tr>
                    <tr>
                        <th>Approaching the Learning Target</th>
                        <td>
                            <strong>Is familiar with key vocabulary and concepts related to the lesson target(s). Can describe certain vocabulary terms but cannot yet apply the terms to successfully meet the learning target(s).</strong>
                            <br>${data.approaching || 'Description not provided.'}
                        </td>
                    </tr>
                    <tr>
                        <th>Meeting the Learning Target</th>
                        <td>
                            <strong>Successfully meets the learning target(s) as defined.</strong>
                            <br>${data.meeting || 'Copy and paste the learning target(s) here.'}
                        </td>
                    </tr>
                    <tr>
                        <th>Exceeding Expectations</th>
                        <td>
                            <strong>Applies the learning target(s) fluidly and with intention. Makes adaptations to meet the unique conditions of a specific task, explains the rationale behind each decision, and models its use for peers or in mentoring scenarios.</strong>
                            <br>${data.exceeding || 'Description not provided.'}
                            ${data.exceedingSkills ? `<br><br><strong>Additional skills demonstrated:</strong> ${data.exceedingSkills}` : ''}
                        </td>
                    </tr>
                </table>
                
                ${data.whatWentWell || data.whatNotAwesome || data.howImprove || data.actionsImprove ? `
                <h4>Optional Reflection to Inform Future Teaching of this Lesson to Another Cohort</h4>
                <table class="preview-table">
                    <tr>
                        <th>What went well? Why?</th>
                        <td>${data.whatWentWell || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th>What was less than awesome? Why?</th>
                        <td>${data.whatNotAwesome || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th>How can I improve this lesson?</th>
                        <td>${data.howImprove || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th>What actions can I take to improve things in general?</th>
                        <td>${data.actionsImprove || 'N/A'}</td>
                    </tr>
                </table>
                ` : ''}
                
                <hr>
                <p class="text-center text-muted">Generated by CCPS Lesson Plan Generator on  ${new Date().toLocaleDateString()}</p>
            `;
}

// Generate PDF
async function generatePDF() {
    // Validate form
    if (!validateForm()) {
        return;
    }

    // Show loading state
    const generateBtn = document.querySelector('button[onclick="generatePDF()"]');
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
    generateBtn.disabled = true;

    try {
        // Get form data and generate preview HTML
        const data = getFormData();
        const previewHTML = generatePreviewHTML(data);
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Create a temporary container for the preview HTML
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '794px'; // A4 at 96dpi
        tempDiv.style.minHeight = '1123px'; // A4 at 96dpi
        tempDiv.style.background = 'white';
        tempDiv.style.padding = '40px';
        tempDiv.style.fontSize = '12px';
        tempDiv.style.fontFamily = 'Times New Roman, Times, serif';
        tempDiv.innerHTML = previewHTML;
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);


        // Use html2canvas to capture the content as a JPEG image (smaller size)
        const canvas = await html2canvas(tempDiv, {
            scale: 1, // Lower scale for smaller file size
            useCORS: true,
            backgroundColor: '#fff'
        });

        // Remove the temporary container
        document.body.removeChild(tempDiv);

        // Calculate image dimensions for A4
        const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG and set quality
        const pdfWidth = 210; // mm
        const pdfHeight = 297; // mm
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        let position = 0;
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);

        // Add more pages if needed
        let remainingHeight = imgHeight;
        while (remainingHeight > pdfHeight) {
            position = position - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            remainingHeight -= pdfHeight;
        }

        // Alternative: Use jsPDF's html() method for even smaller PDFs (text-based)
        // Uncomment below to use text-based PDF generation:
        // await pdf.html(tempDiv, { x: 10, y: 10, width: 190 });

        // Save PDF
        const fileName = `LessonPlan_${data.instructor ? data.instructor.replace(/\s+/g, '_') : 'Unknown'}_${data.date || ''}.pdf`;
        pdf.save(fileName);
        alert(`Lesson plan PDF generated successfully: ${fileName}`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating the PDF. Please try again.');
    } finally {
        // Restore button state
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
    }
}

// Validate form
function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;

    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;

            // Scroll to first invalid field
            if (isValid === false) {
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                field.focus();
                break;
            }
        } else {
            field.classList.remove('is-invalid');
        }
    }

    if (!isValid) {
        alert('Please fill in all required fields (marked with *).');
    }

    return isValid;
}

// Initialize date field with today's date
document.getElementById('date').valueAsDate = new Date();

// Add validation styling on input
document.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', function () {
        if (this.value.trim()) {
            this.classList.remove('is-invalid');
        }
    });
});