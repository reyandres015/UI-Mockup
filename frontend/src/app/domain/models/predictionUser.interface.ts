export interface PredictionUser {
  predicted_stress_level: number;
  is_high_stress: boolean;
  decision_action: string;
  message_specialist?: string;
}
