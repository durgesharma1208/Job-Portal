import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, RotateCcw, SlidersHorizontal } from "lucide-react";
import Jobicon from "../components/Jobicon";
import JobDetailsModal from "./JobDetailsModal";
import Button from "../components/ui/Button";
import {
  Alert,
  Badge,
  EmptyState,
  PageShell,
  SearchInput,
  SectionHeader,
  SelectInput,
  SkeletonCard,
} from "../components/ui/Kit";
import { filterJobs, useJobs } from "../hooks/useJobs";

const categoryChips = ["All", "Remote", "Full Time", "Hybrid", "Internship", "Contract"];
const PAGE_SIZE = 9;

const Jobs = () => {
  const { jobs, loading, error, usingFallback, meta } = useJobs();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [level, setLevel] = useState("All");
  const [location, setLocation] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = useMemo(
    () => filterJobs(jobs, { query, type, level, location }),
    [jobs, query, type, level, location]
  );

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const visibleJobs = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = () => {
    setQuery("");
    setType("All");
    setLevel("All");
    setLocation("All");
    setPage(1);
  };

  const updateFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <PageShell wide>
      <SectionHeader
        eyebrow="Browse jobs"
        title="Find your next"
        highlight="high-leverage role"
        description={`${filteredJobs.length} curated openings across modern product and engineering teams.`}
        actions={<Badge tone="green">{usingFallback ? "demo catalog" : "live catalog"}</Badge>}
      />

      <section className="surface-card mb-6 p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_auto]">
          <SearchInput
            value={query}
            onChange={(event) => updateFilter(setQuery)(event.target.value)}
            placeholder="Search role, company, skill, or city"
          />
          <SelectInput value={type} onChange={(event) => updateFilter(setType)(event.target.value)} aria-label="Job type">
            {meta.types.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </SelectInput>
          <SelectInput value={level} onChange={(event) => updateFilter(setLevel)(event.target.value)} aria-label="Experience level">
            {meta.levels.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </SelectInput>
          <SelectInput value={location} onChange={(event) => updateFilter(setLocation)(event.target.value)} aria-label="Location">
            {meta.locations.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </SelectInput>
          <Button variant="secondary" leftIcon={RotateCcw} onClick={resetFilters}>
            Reset
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categoryChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setType(chip === "Remote" ? "All" : chip);
                setLocation(chip === "Remote" ? "Remote" : "All");
                setPage(1);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border-soft px-3 py-1.5 text-xs font-black text-text-muted transition hover:border-primary/35 hover:bg-[var(--primary-soft)] hover:text-primary"
            >
              <Filter className="size-3.5" />
              {chip}
            </button>
          ))}
        </div>
      </section>

      {error && <Alert className="mb-6">{error}</Alert>}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : visibleJobs.length === 0 ? (
        <EmptyState
          icon={SlidersHorizontal}
          title="No matching roles"
          description="Try removing a filter or searching for a broader role family."
          action={<Button onClick={resetFilters}>Clear filters</Button>}
        />
      ) : (
        <>
          <motion.div layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {visibleJobs.map((job) => (
                <Jobicon key={job._id} job={job} onDetailsClick={() => setSelectedJob(job)} />
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-lg border border-border-soft bg-surface p-3 sm:flex-row">
            <p className="text-sm font-semibold text-text-muted">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                Previous
              </Button>
              <Button disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <JobDetailsModal
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        job={selectedJob || {}}
      />
    </PageShell>
  );
};

export default Jobs;
