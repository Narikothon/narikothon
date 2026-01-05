export function getPaginationNumbers(current: number, total: number): (number | 'ellipsis')[] {
	const pages: (number | 'ellipsis')[] = [];
	
	if (total <= 5) {
		// If 5 or fewer pages, show all
		for (let i = 1; i <= total; i++) {
			pages.push(i);
		}
	} else {
		// Always show first page
		pages.push(1);
		
		if (current <= 3) {
			// Near the beginning: 1, 2, 3, 4, ..., last
			// Show consecutive pages from 1 up to current + 1
			for (let i = 2; i <= Math.min(current + 1, total - 1); i++) {
				pages.push(i);
			}
			if (current + 1 < total - 1) {
				pages.push('ellipsis');
			}
			pages.push(total);
		} else if (current >= total - 2) {
			// Near the end: 1, ..., last-3, last-2, last-1, last
			pages.push('ellipsis');
			for (let i = Math.max(2, current - 1); i <= total; i++) {
				pages.push(i);
			}
		} else {
			// In the middle: 1, ..., prev, current, next, ..., last
			pages.push('ellipsis');
			pages.push(current - 1);
			pages.push(current);
			pages.push(current + 1);
			pages.push('ellipsis');
			pages.push(total);
		}
	}
	
	return pages;
}

