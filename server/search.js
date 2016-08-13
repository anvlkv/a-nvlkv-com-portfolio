SearchSource.defineSource('projects', function(searchText) {
  let options = {sort: {order: 1}, limit: 20};
  let gtDate, ltDate, date;
  if (moment(searchText, 'YYYY').isValid()) {
    date = moment(searchText, 'YYYY');
    gtDate =  date.format();
    ltDate = date.add(1, 'y').subtract(1,'s').format();

    // console.log(new Date(gtDate),new Date(ltDate));
  }

  if(searchText) {
    let regExp = buildRegExp(searchText);
    // let selector = {title: regExp, description: regExp};
    let selector = {$or:[
      {title: regExp},
      {description: regExp},
      {'pages.text': regExp},
      {$and:[
          {startDate:{$gte: new Date(gtDate)}},
          {startDate:{$lte: new Date(ltDate)}},
        ]
      },
      {$and:[
          {endDate:{$gte: new Date(gtDate)}},
          {endDate:{$lte: new Date(ltDate)}},
        ]
      },
    ]};
    // console.log(selector);
    return Projects.find(selector, options).fetch();
  } else {
    return Projects.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  let words = searchText.trim().split(/[ \-\:]+/);
  let exps = _.map(words, function(word) {
    return "(?=.*" + word + ")";
  });
  let fullExp = exps.join('') + ".+";
  return new RegExp(fullExp, "i");
}

function matchDate (exp){


  return this.endDate ? this.endDate.toString() : false;
}