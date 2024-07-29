from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from .models import Property
from . import db
from datetime import datetime
from .forms import PropertyForm
from werkzeug.utils import secure_filename
from .forms import PropertyForm
from flask import current_app
import os


admin = Blueprint("admin", __name__)


@admin.route("/manage-properties", methods=["GET", "POST"])
@login_required
def manage_properties():
    form = PropertyForm()
    edit_form = None
    edit_property = None
    edit_property_id = request.args.get("edit")

    if edit_property_id:
        edit_property = Property.query.get_or_404(edit_property_id)
        edit_form = PropertyForm(obj=edit_property)
        if edit_form.validate_on_submit():
            edit_property.title = edit_form.title.data
            edit_property.description = edit_form.description.data
            edit_property.current_price = edit_form.current_price.data
            edit_property.location = edit_form.location.data
            edit_property.category = edit_form.category.data
            if edit_form.image_url.data:
                image_file = edit_form.image_url.data
                image_filename = secure_filename(image_file.filename)
                image_path = os.path.join(
                    current_app.root_path, "media", image_filename
                )
                image_file.save(image_path)
                edit_property.image_url = image_filename
            edit_property.available = edit_form.available.data
            edit_property.for_sale = edit_form.for_sale.data
            db.session.commit()
            flash("Property updated successfully", "success")
            return redirect(url_for("admin.manage_properties"))
    else:
        if form.validate_on_submit():
            image_filename = None
            if form.image_url.data:
                image_file = form.image_url.data
                image_filename = secure_filename(image_file.filename)
                image_path = os.path.join(
                    current_app.root_path, "media", image_filename
                )
                image_file.save(image_path)

            new_property = Property(
                title=form.title.data,
                description=form.description.data,
                current_price=form.current_price.data,
                location=form.location.data,
                category=form.category.data,
                image_url=image_filename,
                available=form.available.data,
                for_sale=form.for_sale.data,
                date_added=datetime.utcnow(),
            )
            try:
                db.session.add(new_property)
                db.session.commit()
                flash("Property added successfully", "success")
                return redirect(url_for("admin.manage_properties"))
            except Exception as e:
                db.session.rollback()
                flash("Error adding property: {}".format(e), "danger")

    properties = Property.query.all()
    return render_template(
        "manage_properties.html",
        form=form,
        edit_form=edit_form,
        edit_property=edit_property,
        properties=properties,
    )


@admin.route("/delete-property/<int:property_id>", methods=["POST"])
@login_required
def delete_property(property_id):
    property = Property.query.get_or_404(property_id)
    db.session.delete(property)
    db.session.commit()
    flash("Property deleted successfully", "success")
    return redirect(url_for("admin.manage_properties"))
