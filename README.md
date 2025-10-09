# Kertokt

## Automatic Analysis of Consumer Reports

Kertokt now ships with a lightweight application that merges Environmental
Working Group (EWG) summaries, municipal utility company reports, and household
coverage benefits into a single actionable briefing. The toolkit ingests JSON
exports, highlights contaminants that exceed health or legal limits, and pairs
them with programs or insurance benefits that help customers take action—just
like a personal DoNotPay for home and health services.

- Run the CLI against the bundled Denver Water sample data:

  ```bash
  PYTHONPATH=src python -m kertokt.cli --sample
  ```

- Analyze your own exports by pointing the tool to structured JSON files:

  ```bash
  PYTHONPATH=src python -m kertokt.cli \
    --ewg path/to/ewg.json \
    --utility path/to/utility.json \
    --coverage path/to/benefits.json
  ```

The CLI prints consolidated findings and recommendation bulletins that a
customer success agent (or the household themselves) can follow to request
tests, claim rebates, and leverage existing insurance perks.

See [docs/automation_plan.md](docs/automation_plan.md) for a deeper look at the
product and technical roadmap. The live toolkit implements the ingestion,
analysis, and recommendation layers described in that plan.
