from django.db import models
from django.conf import settings
from inventory.models import InventoryItem

class Field(models.Model):
    name = models.CharField(max_length=100)
    location_description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Crop(models.Model):
    name = models.CharField(max_length=100)
    field = models.ForeignKey(Field, on_delete=models.CASCADE)
    planting_date = models.DateField()
    expected_harvest_date = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ("planted", "Planted"),
        ("growing", "Growing"),
        ("harvested", "Harvested")
    ], default="planted")

    def __str__(self):
        return f"{self.name} in {self.field.name}"

class InputUsed(models.Model):
    crop = models.ForeignKey(
        Crop,
        on_delete=models.CASCADE,
        related_name="inputs_used"
    )
    # 👇 Link to the main inventory
    inventory_item = models.ForeignKey(
        InventoryItem,
        on_delete=models.SET_NULL, # Don't delete record if inventory item is deleted
        null=True
    )
    amount_used = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="The amount of the inventory item used for this crop"
    )
    date_used = models.DateField()


    class Meta:
        ordering = ['-date_used']
        verbose_name = "Input Used"
        verbose_name_plural = "Inputs Used"

    def __str__(self):
        return f"{self.amount_used} of {self.inventory_item.name} for {self.crop.name}"

