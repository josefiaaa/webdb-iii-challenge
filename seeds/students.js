exports.seed = function(knex, Promise) {
  return knex("students")
    .truncate()
    .then(function() {
      return knex("students").insert([
        { name: "Josi", cohort_id: 1 },
        { name: "Rene", cohort_id: 1 },
        { name: "Taylor", cohort_id: 4 },
        { name: "Kevin", cohort_id: 6 },
        { name: "Martin", cohort_id: 7 }
      ]);
    });
};