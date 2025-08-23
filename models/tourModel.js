const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'The name should have 40 chars max'],
      minLength: [10, 'The name should have 10 chars min'],
      // validate: [validator.isAlpha, 'only letters'],
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    duration: {
      type: Number,
      required: [true, 'A otur must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A otur must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A otur must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      set: (val) => Math.round(val * 10) / 10, // 4.66666->46.66 -> 47 ->4.7
      min: [1, 'Rating should be above 1.0'],
      max: [5, 'Rating should be bellow 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) more than price',
      },
    },
    summary: {
      type: String,
      trim: true, // Add this to name as well
      required: [true, 'A otur must have a summary'],
    },
    description: {
      type: String,
      trim: true, // Add this to name as well
    },
    imageCover: {
      type: String,
      required: [true, 'A otur must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GEOJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    locations: [
      {
        //GEOJSON
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        day: Number,
        address: String,
        description: String,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toOBJECT: { virtuals: true },
  },
);
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.virtual('dirationWeeks').get(function () {
  return this.duration / 7;
});
// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Inside tourModel, this will add populate to the current query
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// Document middleware: .pre() runs before .save() and .create(), not .createMany()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', function(next){
//   console.log('Will save document...');
//   next();
// });
// // Document middleware: .post() runs after all .pre() functions
// tourSchema.post('save', function(doc, next){
//   console.log(doc);
//   next();
// })

// QUERY MIDDLEWARE
// This works for .find(), not .findOne (findByID)
// tourSchema.pre('find', function(next){
tourSchema.pre(/^find/, function (next) {
  // all that starts with find
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
// The aggregation object is the pipeline, which is an array
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // unshift adds at the beginning of the array
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema); //This creates a model from the schema
module.exports = Tour;
