exports.seed = function(knex, Promise) {
  return knex("cohorts")
    .truncate()
    .then(function() {
      return knex("cohorts").insert([
        { name: "WEB18" },
        { name: "CS10" },
        { name: "WEB16" },
      ]);
    }
  );
};