// API Configuration
const API_BASE_URL = 'https://college-notifier-g7d8.onrender.com';

// DOM Elements
const generateAssignmentBtn = document.getElementById('generateAssignment') as HTMLButtonElement;
const assignmentTopic = document.getElementById('assignmentTopic') as HTMLTextAreaElement;
const assignmentOutput = document.getElementById('assignmentOutput') as HTMLDivElement;
const assignmentResult = document.getElementById('assignmentResult') as HTMLDivElement;
const downloadAssignmentBtn = document.getElementById('downloadAssignment') as HTMLButtonElement;

const generateShortBtn = document.getElementById('generateShort') as HTMLButtonElement;
const shortQuestion = document.getElementById('shortQuestion') as HTMLInputElement;
const shortOutput = document.getElementById('shortOutput') as HTMLDivElement;
const shortResult = document.getElementById('shortResult') as HTMLDivElement;

const generateLongBtn = document.getElementById('generateLong') as HTMLButtonElement;
const longQuestion = document.getElementById('longQuestion') as HTMLTextAreaElement;
const longOutput = document.getElementById('longOutput') as HTMLDivElement;
const longResult = document.getElementById('longResult') as HTMLDivElement;
const downloadLongBtn = document.getElementById('downloadLong') as HTMLButtonElement;

const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal') as HTMLElement);
const loadingText = document.getElementById('loadingText') as HTMLParagraphElement;

// Utility Functions
const showLoading = (message: string = 'This may take a few moments') => {
    loadingText.textContent = message;
    loadingModal.show();
};

const hideLoading = () => {
    loadingModal.hide();
};

const showError = (message: string) => {
    hideLoading();
    alert(`Error: ${message}`);
};

const markdownToHtml = (text: string): string => {
    // Simple markdown to HTML conversion
    return text
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^\* (.*$)/gm, '<li>$1</li>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
};

// API Calls
const generateAssignment = async (topic: string) => {
    showLoading('Generating your assignment...');
    try {
        const response = await fetch(`${API_BASE_URL}/generate-assignment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: topic }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        assignmentOutput.innerHTML = markdownToHtml(data.text);
        assignmentResult.classList.remove('d-none');
    } catch (error) {
        showError(error instanceof Error ? error.message : 'Failed to generate assignment');
    } finally {
        hideLoading();
    }
};

const generateShortAnswer = async (question: string) => {
    showLoading('Generating short answer...');
    try {
        const response = await fetch(`${API_BASE_URL}/generate-short-answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: question }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        shortOutput.textContent = data.text;
        shortResult.classList.remove('d-none');
    } catch (error) {
        showError(error instanceof Error ? error.message : 'Failed to generate short answer');
    } finally {
        hideLoading();
    }
};

const generateLongAnswer = async (question: string) => {
    showLoading('Generating detailed answer...');
    try {
        const response = await fetch(`${API_BASE_URL}/generate-long-answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: question }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        longOutput.innerHTML = markdownToHtml(data.text);
        longResult.classList.remove('d-none');
    } catch (error) {
        showError(error instanceof Error ? error.message : 'Failed to generate long answer');
    } finally {
        hideLoading();
    }
};

const downloadAsPdf = async (content: string, filename: string) => {
    showLoading('Preparing PDF download...');
    try {
        const response = await fetch(`${API_BASE_URL}/download-pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, filename }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        showError(error instanceof Error ? error.message : 'Failed to download PDF');
    } finally {
        hideLoading();
    }
};

// Event Listeners
generateAssignmentBtn.addEventListener('click', () => {
    if (!assignmentTopic.value.trim()) {
        alert('Please enter an assignment topic');
        return;
    }
    generateAssignment(assignmentTopic.value.trim());
});

downloadAssignmentBtn.addEventListener('click', () => {
    if (!assignmentOutput.innerHTML.trim()) {
        alert('No assignment content to download');
        return;
    }
    const filename = `assignment-${assignmentTopic.value.trim().substring(0, 20)}` || 'assignment';
    downloadAsPdf(assignmentOutput.innerHTML, filename);
});

generateShortBtn.addEventListener('click', () => {
    if (!shortQuestion.value.trim()) {
        alert('Please enter a question');
        return;
    }
    generateShortAnswer(shortQuestion.value.trim());
});

generateLongBtn.addEventListener('click', () => {
    if (!longQuestion.value.trim()) {
        alert('Please enter a question');
        return;
    }
    generateLongAnswer(longQuestion.value.trim());
});

downloadLongBtn.addEventListener('click', () => {
    if (!longOutput.innerHTML.trim()) {
        alert('No content to download');
        return;
    }
    const filename = `answer-${longQuestion.value.trim().substring(0, 20)}` || 'long-answer';
    downloadAsPdf(longOutput.innerHTML, filename);
});

// Initialize tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map((tooltipTriggerEl) => {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});
