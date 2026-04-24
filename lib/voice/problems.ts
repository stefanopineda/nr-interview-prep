export interface VoiceProblem {
  id: string
  topic: string
  prompt: string
  spoken_prompt: string
  reference_solution: string
}

export const VOICE_PROBLEMS: VoiceProblem[] = [
  {
    id: "v-momentum-1",
    topic: "Conservation of Momentum",
    prompt: "A 2 kg ball moving at 3 m/s collides with a stationary 1 kg ball. The two balls stick together after the collision. Find the velocity of the combined mass.",
    spoken_prompt: "Here is your first problem. A two-kilogram ball moving at three meters per second collides with a one-kilogram ball that is sitting still. After the collision the two balls stick together. Find the velocity of the combined mass. Take your time, draw it out on the whiteboard, and when you are ready, walk me through your solution.",
    reference_solution: "Perfectly inelastic collision. m1*v1 + m2*v2 = (m1+m2)*vf. (2)(3) + (1)(0) = 3*vf. vf = 2 m/s in the original direction.",
  },
  {
    id: "v-energy-1",
    topic: "Conservation of Energy",
    prompt: "A 0.5 kg block is released from rest at the top of a frictionless ramp 2 m tall. How fast is it moving at the bottom?",
    spoken_prompt: "Next problem. A zero-point-five kilogram block is released from rest at the top of a frictionless ramp that is two meters tall. How fast is the block moving when it reaches the bottom? Use the whiteboard, then explain your reasoning.",
    reference_solution: "Conservation of energy: mgh = (1/2)mv^2. The mass cancels. v = sqrt(2gh) = sqrt(2*9.8*2) ≈ 6.26 m/s.",
  },
  {
    id: "v-momentum-2",
    topic: "Conservation of Momentum",
    prompt: "Cart A (4 kg) moves right at 5 m/s. Cart B (6 kg) moves left at 2 m/s. They collide and stick together. What is the final velocity of the combined carts?",
    spoken_prompt: "Here is another one. Cart A weighs four kilograms and is moving to the right at five meters per second. Cart B weighs six kilograms and is moving to the left at two meters per second. They collide and stick together. What is the final velocity of the combined carts, and in which direction? Work it out, then walk me through your logic.",
    reference_solution: "Define right as positive. m1*v1 + m2*v2 = (m1+m2)*vf. (4)(5) + (6)(-2) = 10*vf. 20 - 12 = 10*vf. vf = 0.8 m/s to the right.",
  },
  {
    id: "v-energy-2",
    topic: "Conservation of Energy",
    prompt: "A 0.2 kg ball is dropped from rest at a height of 10 m. Ignoring air resistance, what is its speed just before it hits the ground?",
    spoken_prompt: "Try this one. A zero-point-two kilogram ball is dropped from rest at a height of ten meters. Ignoring air resistance, what is its speed just before it hits the ground? Show your work on the whiteboard, then explain.",
    reference_solution: "Mass cancels. v = sqrt(2gh) = sqrt(2*9.8*10) = sqrt(196) = 14 m/s.",
  },
  {
    id: "v-energy-3",
    topic: "Kinetic Energy",
    prompt: "A 2 kg object has 36 J of kinetic energy. What is its speed?",
    spoken_prompt: "Last one. A two-kilogram object has thirty-six joules of kinetic energy. What is its speed? Work through it and explain.",
    reference_solution: "KE = (1/2)mv^2 → v = sqrt(2*KE/m) = sqrt(2*36/2) = sqrt(36) = 6 m/s.",
  },
]

export function getVoiceProblem(id: string): VoiceProblem | undefined {
  return VOICE_PROBLEMS.find((p) => p.id === id)
}
