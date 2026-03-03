export interface HeroProps {
    dreamOutcome: string;
    perceivedLikelihood: string;
    timeDelay: string;
    effortSacrifice: string;
}

export const generateHeroAB = (props: HeroProps) => {
    const variationA = `<section><h1>Get ${props.dreamOutcome} in ${props.timeDelay}</h1>...</section>`;
    const variationB = `<section><h1>Stop ${props.effortSacrifice}. Start ${props.dreamOutcome}</h1>...</section>`;
    return { variationA, variationB };
};
