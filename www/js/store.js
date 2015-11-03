angular.module('affirm.store', [])
    .factory('Store', function() {

      var affirmations = angular.fromJson(window.localStorage['affirmations'] || '[]');

      function persist() {
        window.localStorage['affirmations'] = angular.toJson(affirmations);
      }

      return {

        list: function() {
          return affirmations;
        },

        get: function(affirmationId) {
          for (var i = 0; i < affirmations.length; i++) {
            if (affirmations[i].id === affirmationId) {
              return affirmations[i];
            }
          }
          return undefined;
        },

        create: function(affirmation) {
          affirmations.push(affirmation);
          persist();
        },

        update: function(affirmation) {
          for (var i = 0; i < affirmations.length; i++) {
            if (affirmations[i].id === affirmation.id) {
              affirmations[i] = affirmation;
              persist();
              return;
            }
          }
        },

        remove: function(affirmationId) {
          for (var i = 0; i < affirmations.length; i++) {
            if (affirmations[i].id === affirmationId) {
              affirmations.splice(i, 1);
              persist();
              return;
            }
          }
        }

      };

    });