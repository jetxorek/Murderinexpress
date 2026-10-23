export type TruthValue = 'true' | 'plausible' | 'false';
export type NoteCategory = 'motive' | 'opportunity' | 'alibi' | 'psychology' | 'contradiction';

export type TruthTable = Record<
  string,
  Partial<Record<NoteCategory, Record<string, TruthValue>>>
>;

export const TRUTH_TABLE: TruthTable = {
  group: {
    motive: {
      revenge_for_masha: 'true',
      all_conspired: 'true',
      money: 'false',
    },
    opportunity: {
      conductor_distributed_keys: 'true',
      all_in_corridor_at_night: 'true',
      everyone_had_alibi_ready: 'true',
      external_killer: 'false',
    },
    alibi: {
      alibis_mutually_confirming: 'true',
      no_one_saw_anyone: 'plausible',
    },
    psychology: {
      each_knew_victim_before: 'true',
      each_hid_connection: 'true',
      each_showed_grief_for_masha: 'true',
    },
    contradiction: {
      conductor_and_colonel_testimonies_clash: 'true',
      princess_and_maid_alibis_collapse: 'true',
      countess_lies_about_sleeping_pills: 'true',
      professor_lies_about_library: 'true',
      open_window_is_staged_escape: 'true',
      red_kimono_is_plant: 'true',
      clock_manipulated: 'true',
    },
  },
  char_01: {
    motive: {
      duty_to_nikolai_arsenyev: 'true',
      personal_grudge: 'plausible',
      money: 'false',
    },
    opportunity: {
      corridor_at_2am: 'true',
      smoked_in_vestibule_all_night: 'false',
      had_access_to_razumov_compartment: 'true',
    },
    alibi: {
      vestibule_all_night: 'false',
      conductor_can_confirm: 'false',
    },
    psychology: {
      taps_portcigarette_when_nervous: 'true',
      avoids_eye_contact_when_lying: 'true',
      protects_maid: 'true',
      grief_for_arsenyev_family: 'true',
    },
    contradiction: {
      claims_vestibule_vs_conductor_saw_him_elsewhere: 'true',
      claims_not_acquainted_vs_family_friend: 'true',
    },
  },
  char_02: {
    motive: {
      vengeance_for_masha: 'true',
      grief_for_niece: 'true',
      money: 'false',
      jealousy: 'plausible',
    },
    opportunity: {
      corridor_at_2am: 'true',
      sleeping_pills: 'false',
      was_near_compartment: 'true',
    },
    alibi: {
      slept_after_sleeping_pills: 'false',
      no_one_can_confirm: 'true',
    },
    psychology: {
      touches_brooch_when_lying: 'true',
      fear_of_princess: 'true',
      grief_for_masha: 'true',
      seeks_sympathy: 'true',
    },
    contradiction: {
      claims_asleep_vs_conductor_saw_her: 'true',
      brooch_belongs_to_arsenyev_family: 'true',
    },
  },
  char_03: {
    motive: {
      vengeance_for_goddaughter: 'true',
      pride_and_justice: 'true',
      inheritance: 'false',
      old_grudge: 'plausible',
    },
    opportunity: {
      corridor_at_night: 'true',
      read_all_night: 'false',
      organized_conspiracy: 'true',
    },
    alibi: {
      maid_confirms_reading: 'false',
      no_direct_confirmation: 'true',
    },
    psychology: {
      chess_player: 'true',
      contempt_for_weakness: 'true',
      commands_conductor: 'true',
      pride: 'true',
    },
    contradiction: {
      claims_maid_confirmed_vs_maid_silent: 'true',
      claims_stranger_vs_godmother_of_masha: 'true',
    },
  },
  char_04: {
    motive: {
      vengeance_for_sister_nanny: 'true',
      duty: 'true',
      fear_of_princess: 'plausible',
      money: 'false',
    },
    opportunity: {
      had_keys: 'true',
      could_open_locked_doors: 'true',
      in_service_compartment: 'false',
    },
    alibi: {
      in_compartment_checking_documents: 'false',
      no_documents_found: 'true',
    },
    psychology: {
      wipes_things_constantly: 'true',
      fears_princess: 'true',
      grief_for_sister: 'true',
      nervous_around_conductor_role: 'true',
    },
    contradiction: {
      claims_compartment_vs_keys_missing_overnight: 'true',
      claims_stranger_vs_served_arsenyev_family: 'true',
      button_is_planted: 'true',
    },
  },
  char_05: {
    motive: {
      father_ruined_defending_arsenyevs: 'true',
      personal_hatred_of_razumov: 'true',
      career_or_money: 'plausible',
      revenge_for_masha: 'true',
    },
    opportunity: {
      knew_razumov_schedule: 'true',
      had_access_to_razumov_papers: 'true',
      sorting_papers_in_compartment: 'false',
    },
    alibi: {
      sorting_papers: 'false',
      no_papers_found: 'true',
    },
    psychology: {
      adjusts_glasses: 'true',
      nervous_tic: 'true',
      knows_financial_schemes: 'true',
      seeks_ally_in_pirogov: 'true',
    },
    contradiction: {
      claims_papers_vs_nothing_found: 'true',
      claims_stranger_vs_father_was_family_lawyer: 'true',
    },
  },
  char_06: {
    motive: {
      grief_for_masha_whom_she_nursed: 'true',
      loyalty_to_princess: 'true',
      money: 'false',
    },
    opportunity: {
      near_princess_at_night: 'true',
      with_princess_all_night: 'false',
      saw_masha_last_alive: 'true',
    },
    alibi: {
      with_princess_all_night: 'false',
      no_one_can_confirm: 'true',
    },
    psychology: {
      lowers_eyes: 'true',
      german_accent_when_emotional: 'true',
      sees_masha_face: 'true',
      cries_when_alone: 'plausible',
    },
    contradiction: {
      claims_with_princess_vs_princess_alibi_also_false: 'true',
      nanny_of_masha_hidden: 'true',
    },
  },
  char_07: {
    motive: {
      vengeance_for_student_masha: 'true',
      intellectual_curiosity: 'plausible',
      academic_jealousy: 'false',
      money: 'false',
    },
    opportunity: {
      read_in_library: 'false',
      corridor_at_night: 'true',
      planned_role_in_conspiracy: 'true',
    },
    alibi: {
      library_reading: 'false',
      library_was_locked: 'true',
    },
    psychology: {
      mutters: 'true',
      forgets_names_not_details: 'true',
      plays_intellectual_games: 'true',
      knows_everyones_weakness: 'true',
    },
    contradiction: {
      claims_library_vs_library_locked: 'true',
      claims_stranger_vs_tutor_of_masha: 'true',
      pipe_cleaner_is_planted: 'true',
    },
  },
  victim: {
    motive: {
      offers_money_for_protection: 'true',
      dark_past: 'true',
    },
    psychology: {
      fears_someone: 'true',
      paranoid: 'true',
    },
    opportunity: {
      locked_his_compartment: 'true',
    },
  },
};
