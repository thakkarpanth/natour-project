const fs = require('fs');
const express = require('express');
const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res,next) => {
  
    const features = new APIFeatures(Tour, req.query).filter().sort().limitFields().paginate();
    const tours = await features.query;

    // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

    res.status(200);
    res.json({
      status: 'accepted',
      result: tours.length,
      data: {
        tours: tours,
      },
    });
 
});

exports.createTour = catchAsync(async (req, res , next) => {
  
  const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
});

exports.getTour = catchAsync(async (req, res,next) => {
  console.log(req.params);
  let id = req.params.id;
  const tour = await Tour.findById(id);
    
    if(!tour){
      return next(new AppError('Tour not found' , 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  
});
exports.updateTour = catchAsync ( async (req, res,next) => {
  let id = req.params.id;

    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if(!tour){
      return next(new AppError('Tour not found' , 404));
    }
    res.status(200);
    res.json({
      status: 'accepted',
      tour: tour,
    });
  
});

exports.deleteTour = catchAsync(async (req, res , next) => {
  let id = req.params.id;
    const tour = await Tour.findByIdAndDelete(id);
    if(!tour){
      return next(new AppError('Tour not found' , 404));
    }
    res.status('204');
    res.end('Deleted....');
 
});

exports.getTourStats = catchAsync(async (req, res , next) => {
  
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.0 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
   
});

exports.getMonthlyPlan =catchAsync(async (req, res , next) => {
  
    //console.log('Year is ' + req.params.year);
    const year = { ...req.params };
    const currYear = year.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${currYear}-01-01`),
            $lte: new Date(`${currYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numToursStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  
});
