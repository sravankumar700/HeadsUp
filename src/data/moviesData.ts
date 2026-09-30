import rawCsv from './TeluguMovies_dataset.csv?raw';

export interface CsvMovieRecord {
  id: string;
  title: string;
  releaseYear: number | null;
  certificate: string;
  genres: string[];
  overview: string;
  runtime: number | null;
  rating: number | null;
  numberOfRatings: number;
  releaseStatus: 'released' | 'upcoming';
}

// Robust CSV parser handling quotes, commas, and newlines
function parseCsv(csvText: string): CsvMovieRecord[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Header inspection
  const headerLine = lines[0];
  const headers = parseLine(headerLine).map((h) => h.trim().toLowerCase());
  
  const movieIdx = headers.findIndex((h) => h === 'movie' || h === 'title');
  const yearIdx = headers.findIndex((h) => h === 'year');
  const certIdx = headers.findIndex((h) => h === 'certificate');
  const genreIdx = headers.findIndex((h) => h === 'genre');
  const overviewIdx = headers.findIndex((h) => h === 'overview');
  const runtimeIdx = headers.findIndex((h) => h === 'runtime');
  const ratingIdx = headers.findIndex((h) => h === 'rating');
  const numRatingsIdx = headers.findIndex((h) => h.includes('no.of.ratings') || h.includes('ratings'));

  const seenTitles = new Set<string>();
  const records: CsvMovieRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = parseLine(lines[i]);
    if (rawCols.length <= 1) continue;

    const rawTitle = movieIdx !== -1 && rawCols[movieIdx] ? rawCols[movieIdx].trim() : '';
    if (!rawTitle) continue;

    // Remove duplicates based on normalized title
    const normalizedKey = rawTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seenTitles.has(normalizedKey)) continue;
    seenTitles.add(normalizedKey);

    // Year conversion
    let year: number | null = null;
    if (yearIdx !== -1 && rawCols[yearIdx]) {
      const parsedYear = parseInt(rawCols[yearIdx].replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsedYear) && parsedYear > 1920 && parsedYear <= 2030) {
        year = parsedYear;
      }
    }

    // Certificate
    const certificate = certIdx !== -1 && rawCols[certIdx] ? rawCols[certIdx].trim() : 'U';

    // Genres
    let genres: string[] = [];
    if (genreIdx !== -1 && rawCols[genreIdx]) {
      genres = rawCols[genreIdx]
        .split(',')
        .map((g) => g.trim())
        .filter((g) => g.length > 0);
    }

    // Overview
    const overview = overviewIdx !== -1 && rawCols[overviewIdx] ? rawCols[overviewIdx].trim() : '';

    // Runtime
    let runtime: number | null = null;
    if (runtimeIdx !== -1 && rawCols[runtimeIdx]) {
      const parsedRuntime = parseInt(rawCols[runtimeIdx].replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsedRuntime) && parsedRuntime > 0) {
        runtime = parsedRuntime;
      }
    }

    // Rating
    let rating: number | null = null;
    if (ratingIdx !== -1 && rawCols[ratingIdx]) {
      const parsedRating = parseFloat(rawCols[ratingIdx]);
      if (!isNaN(parsedRating) && parsedRating >= 0 && parsedRating <= 10) {
        rating = parsedRating;
      }
    }

    // Number of Ratings
    let numberOfRatings = 0;
    if (numRatingsIdx !== -1 && rawCols[numRatingsIdx]) {
      const parsedNum = parseInt(rawCols[numRatingsIdx].replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsedNum)) {
        numberOfRatings = parsedNum;
      }
    }

    // Release status
    const releaseStatus: 'released' | 'upcoming' = year && year >= 2025 ? 'upcoming' : 'released';

    // Generate stable ID
    const stableId = `m_${normalizedKey || i}`;

    records.push({
      id: stableId,
      title: rawTitle,
      releaseYear: year,
      certificate,
      genres,
      overview,
      runtime,
      rating,
      numberOfRatings,
      releaseStatus
    });
  }

  return records;
}

// Parses a single CSV line accounting for quoted substrings
function parseLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// Export cleaned and parsed movie dataset
export const csvMovies: CsvMovieRecord[] = parseCsv(rawCsv);
