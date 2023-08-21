function skillsMember() {
  var member = this;
  member.skills = [];
  member.addSkill = function(skill) {
    member.skills.push(skill);
  };
  member.removeSkill = function(skill) {
    var index = member.skills.indexOf(skill);
    member.skills.splice(index, 1);
  };
  return member;
}