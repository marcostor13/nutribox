export const auditComponent = (html: string) => {
    const feedback: string[] = [];
    let score = 100;

    if (!html.includes('<button') && !html.includes('<a')) {
        feedback.push('Missing Call to Action (CTA)');
        score -= 30;
    }
    if (!/review|testimonial|client|trusted/i.test(html)) {
        feedback.push('No social proof detected');
        score -= 20;
    }
    if (!html.includes('<h1')) {
        feedback.push('Missing H1 headline');
        score -= 25;
    }

    return { score: Math.max(0, score), feedback, passed: score >= 70 };
};
