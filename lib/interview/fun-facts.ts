export const NUCLEAR_FUN_FACTS = [
  "The USS Nautilus (SSN-571) was the world's first nuclear-powered submarine, launched in 1954.",
  "A single uranium fuel pellet — about the size of a pencil eraser — contains as much energy as 17,000 cubic feet of natural gas.",
  "Admiral Hyman G. Rickover, the 'Father of the Nuclear Navy,' personally interviewed every nuclear officer candidate for over 30 years.",
  "The Navy's nuclear propulsion program has safely operated more than 500 reactor-years without a single reactor accident.",
  "Nuclear submarines can operate for over 20 years without refueling.",
  "The reactor compartment of a submarine is so well shielded that crew members receive less radiation than the average person on land.",
  "Navy nuclear operators go through the most rigorous nuclear training program in the world — more selective than most graduate programs.",
  "The USS Enterprise (CVN-65) was the world's first nuclear-powered aircraft carrier, with eight reactors powering the ship.",
  "Power School in Charleston, SC is a 6-month intensive program covering nuclear physics, thermodynamics, and reactor engineering.",
  "Prototype training gives officers hands-on experience operating an actual naval nuclear reactor.",
  "The chain reaction in a nuclear reactor is controlled by inserting or withdrawing control rods made of neutron-absorbing material like hafnium or boron.",
  "Einstein's famous equation E = mc² explains why nuclear reactions release millions of times more energy than chemical reactions.",
  "Heavy water (D₂O) was used as a moderator in early reactor designs because deuterium absorbs fewer neutrons than regular hydrogen.",
  "The critical mass of uranium-235 for a bare sphere is about 52 kg — roughly the size of a softball.",
  "Xenon-135 is one of the strongest neutron absorbers known and builds up in reactors after shutdown, causing 'xenon poisoning.'",
  "The Doppler effect in nuclear reactors is a natural safety feature: as fuel temperature rises, resonance absorption increases, slowing the chain reaction.",
  "Boron is used in control rods and emergency shutdown systems because its isotope ¹⁰B has a very large neutron absorption cross-section.",
  "Naval reactors use highly enriched uranium (HEU) to achieve compact, long-lived cores that fit inside a submarine hull.",
  "The thermal efficiency of a Rankine cycle (used in naval propulsion) is typically 30-35%, limited by the Second Law of Thermodynamics.",
  "Submarines use steam generators (like heat exchangers) to transfer heat from the primary coolant loop to a secondary loop, keeping radioactive water contained.",
  "The Navy's nuclear program has trained over 100,000 officers and enlisted personnel since its inception.",
  "Pressurized water reactors (PWRs) keep the primary coolant under high pressure to prevent boiling, allowing higher operating temperatures.",
  "The concept of 'reactivity' (ρ) measures how far a reactor is from criticality — positive means power increasing, negative means decreasing.",
  "Neutron moderation is the process of slowing fast neutrons to thermal energies where they are more likely to cause fission in U-235.",
  "The NUPOC program offers one of the highest starting salaries of any entry-level engineering position in the country.",
  "Decay heat continues to be produced in a reactor even after shutdown, which is why cooling systems must remain operational.",
  "The buckling parameter (B²) in reactor physics relates the geometry of the reactor to the conditions needed for criticality.",
  "Bernoulli's principle, which you may use in your interview, is also what allows submarines to control depth using their hydroplanes.",
  "The first controlled nuclear chain reaction was achieved by Enrico Fermi under the stands of a squash court at the University of Chicago in 1942.",
  "Zirconium alloy (Zircaloy) is used for fuel cladding because it has a very low neutron absorption cross-section and good corrosion resistance.",
]

export function getRandomFunFact(excludeIndices: Set<number> = new Set()): {
  fact: string
  index: number
} {
  const available = NUCLEAR_FUN_FACTS.map((fact, i) => ({ fact, index: i })).filter(
    ({ index }) => !excludeIndices.has(index),
  )

  if (available.length === 0) {
    // All shown, reset
    const i = Math.floor(Math.random() * NUCLEAR_FUN_FACTS.length)
    return { fact: NUCLEAR_FUN_FACTS[i], index: i }
  }

  const pick = available[Math.floor(Math.random() * available.length)]
  return pick
}
