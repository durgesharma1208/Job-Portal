import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, MapPin, RotateCcw, Search as SearchIcon, Sparkles } from "lucide-react";
import Button from "../components/ui/Button";
import {
  Alert,
  Avatar,
  Badge,
  EmptyState,
  PageShell,
  SearchInput,
  SectionHeader,
  SelectInput,
  SkeletonCard,
} from "../components/ui/Kit";
import { filterJobs, useJobs } from "../hooks/useJobs";

const popularSearches = ["Remote React", "Design Systems", "Cloud Engineer", "Senior Full Stack"];

const Search = () => {
  const { jobs, loading, error, meta, usingFallback } = useJobs();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [level, setLevel] = useState("All");

  const results = useMemo(
    () => filterJobs(jobs, { query, type, level, location: "All" }),
    [jobs, query, type, level]
  );

  const reset = () => {
    setQuery("");
    setType("All");
    setLevel("All");
  };

  return (
    <PageShell wide>
      <SectionHeader
        eyebrow="Search"
        title="Search roles like"
        highlight="a power user"
        description="A focused interface for narrowing thousands of openings into a confident shortlist."
        actions={<Badge tone="blue">{usingFallback ? "demo data" : "live search"}</Badge>}
      />

      <section className="surface-card mb-6 p-5 sm:p-6">
        <div className="grid gap-3 lg:grid-cols-[1.6fr_0.7fr_0.7fr_auto]">
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try product designer, backend, remote, Bangalore"
            aria-label="Search jobs"
          />
          <SelectInput value={type} onChange={(event) => setType(event.target.value)} aria-label="Type">
            {meta.types.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </SelectInput>
          <SelectInput value={level} onChange={(event) => setLevel(event.target.value)} aria-label="Level">
            {meta.levels.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </SelectInput>
          <Button variant="secondary" leftIcon={RotateCcw} onClick={reset}>Reset</Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {popularSearches.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setQuery(item)}
              className="inline-flex items-center gap-2 rounded-full border border-border-soft px-3 py-1.5 text-xs font-black text-text-muted transition hover:border-primary/35 hover:bg-[var(--primary-soft)] hover:text-primary"
            >
              <Sparkles className="size-3.5" />
              {item}
            </button>
          ))}
        </div>
      </section>

      {error && <Alert className="mb-6">{error}</Alert>}

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No results found"
          description="Try a broader keyword or remove one of the filters."
          action={<Button onClick={reset}>Clear search</Button>}
        />
      ) : (
        <motion.div layout className="grid gap-4 lg:grid-cols-2">
          <AnimatePresence>
            {results.map((job) => (
              <motion.article
                layout
                key={job._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="interactive-card p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={job.logo} name={job.company} className="bg-white" />
                    <div>
                      <h2 className="text-xl font-black text-text-strong">{job.role}</h2>
                      <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-text-muted">
                        <Building2 className="size-4 text-primary" />
                        {job.company}
                      </p>
                    </div>
                  </div>
                  <Badge tone="green">{job.salary}</Badge>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge tone="blue">{job.type}</Badge>
                  <Badge tone="violet">{job.level}</Badge>
                  <Badge tone="neutral">
                    <MapPin className="size-3.5" />
                    {job.location}
                  </Badge>
                </div>
                <div className="mt-6 flex justify-end">
                  <Link to="/jobs">
                    <Button variant="secondary" rightIcon={ArrowRight}>Open in jobs</Button>
                  </Link>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </PageShell>
  );
};

export default Search;
