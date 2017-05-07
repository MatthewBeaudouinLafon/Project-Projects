export function toOlinEpoch(humanReadable) {
	const semester = humanReadable.substring(0, humanReadable.length - 4);
	let adjustment;

	if ("fa".includes(semester.toLowerCase())){
		adjustment = 0;
	} else if ("w".includes(semester.toLowerCase())) {
		adjustment = 0.25;
	} else if ("sp".includes(semester.toLowerCase())) {
		adjustment = -0.5;
	} else if ("su".includes(semester.toLowerCase())) {
		adjustment = -0.25;
	}

	return humanReadable.substring(humanReadable.length - 4, humanReadable.length) - 2002 + adjustment;
}

export function fromOlinEpoch(olinEpoch) {
	let semester;
	switch (olinEpoch % 1) {
		case 0:
			semester = "FA";
		break;
		case 0.25:
			semester = "WI";
		break;
		case 0.5:
			semester = "SP";
		break;
		case 0.75:
			semester = "SU";
		break;
	}
	return semester + (Math.round(olinEpoch) + 2002);
}
