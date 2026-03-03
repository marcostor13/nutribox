export interface AstroComponent {
    frontmatter: string;
    template: string;
    fullCode: string;
}

export const parseAstroComponent = (code: string): AstroComponent => {
    const parts = code.split('---\n');
    if (parts.length >= 3) {
        return {
            frontmatter: parts[1],
            template: parts.slice(2).join('---\n').trim(),
            fullCode: code
        };
    }
    return { frontmatter: '', template: code, fullCode: code };
};
