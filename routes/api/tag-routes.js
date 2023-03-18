const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
const { findOne } = require('../../models/Product');


// The `/api/tags` endpoint
  // find all tags
  // be sure to include its associated Product data
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [
        {
          model: Product,
          through: ProductTag,
          as: 'productTag_product'
        }
      ]
    });
    if (!tagData) {
      res.status(404).json({message:"No item found"});
      return;}
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});
  // find a single tag by its `id`
  // be sure to include its associated Product data

router.get('/:id',async (req, res) => {
   try {
    const tagID = await Tag.findOne({
      where: {
        id:req.params.id
      },include:[{
        model: Product,
          through: ProductTag,
          as: 'productTag_product'
      }]
        });
        if (!tagID) {
          res.status(404).json({message:"No tag found with this tag"});
          return;}
          res.status(200).json(tagID)      
       } catch (err) {
       res.status(500).json(err);
      }
})

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(
    {
      tag_name: req.body.tag_name
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then(TagData => {
    if (!TagData) {
        res.status(404).json({ message: 'No Tag found with this id' });
        return;
    }
    res.json(TagData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});


router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      res.status(404).json({ message: 'No Tag found with this id' });
      return;
    }
    await tag.destroy();
    res.json({ message: 'Tag removed' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
