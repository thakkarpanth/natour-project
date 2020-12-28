const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: [40,'A tour name must have at max 40 characters'],
      minlength: [10 , 'A tour must have minimum 10 characters'],
   //   validate : [validator.isAlpha , 'Tour Name must only contain alphabets'] 
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum:{ values : ['easy' , 'medium' , 'difficult'] , message : 'Difficulty can be easy , medium or difficult. '}
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating cannot be less than 1'] ,
      max: [5, 'Rating cannot be more than 5']
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: true,
    },
    priceDiscount: {

      type: Number,
      validate:{ 
        validator : function(val){
          //this only points to current doc on NEW Document creation and not update 
          return val < this.price;

        },
        message : 'Discount price ({VALUE}) should be less than actual price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },

    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual method
tourSchema.virtual('durationWeeks').get(function getWeeks() {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE : runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log('Query took' + (Date.now() - this.start));
  //console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate' , function(next){
  this.pipeline().unshift({$match : {secretTour : {$ne : true}}})
  next();

})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
