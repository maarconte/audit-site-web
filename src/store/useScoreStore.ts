import { create } from "zustand";

interface Category {
	name: string;
	slug: string;
}

interface ScoreState {
	scores: Record<string, number>;
	categories: Category[]; // Or properly typed if known
	updateScore: (categorySlug: string, newScore: number) => void;
	resetScores: () => void;
	setCategories: (categories: Category[]) => void;
}

export const useScoreStore = create<ScoreState>((set) => ({
	scores: {},
	categories: [],
	updateScore: (categorySlug, newScore) =>
		set((state) => ({
			scores: {
				...state.scores,
				[categorySlug]: newScore,
			},
		})),
	resetScores: () => set({ scores: {} }),
	setCategories: (categories) => set({ categories }),
}));
